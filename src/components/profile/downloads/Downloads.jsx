"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import {
  Download,
  FileText,
  Receipt,
  Calendar,
  Filter,
  Search,
  CheckCircle,
  Shield,
  Wallet,
  X,
  FileCheck,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Award,
  FileBadge
} from "lucide-react"
import { useFetchMyDonationsQuery } from "@/utils/slices/donationApiSlice"
import { useSelector } from "react-redux"
import { getMediaUrl } from "@/utils/media"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function DownloadsPage({ darkModeFromParent }) {
  const [darkMode, setDarkMode] = useState(false)
  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    if (darkModeFromParent !== undefined) {
      setDarkMode(darkModeFromParent)
    }
  }, [darkModeFromParent])

  const [currentPage, setCurrentPage] = useState(1)
  const [openDropdownId, setOpenDropdownId] = useState(null)

  // ── Financial Year dropdown ──────────────────────────────────────────────
  const [fyDropdownOpen, setFyDropdownOpen] = useState(false)

  const getAvailableFYs = () => {
    const now = new Date()
    const currentMonth = now.getMonth() // 0-indexed; April = 3
    const currentYear = now.getFullYear()
    // If month >= April the current FY started this year, else it started last year
    const currentFYStartYear = currentMonth >= 3 ? currentYear : currentYear - 1
    // Expose only the 3 *completed* FYs — current FY only available from next April
    return [0, 1, 2].map((offset) => {
      const startYear = currentFYStartYear - 1 - offset
      const endYear = startYear + 1
      return {
        label: `FY ${String(startYear).slice(-2)}-${String(endYear).slice(-2)}`,
        startYear,
        endYear,
        startDate: `${startYear}-04-01`,
        endDate: `${endYear}-03-31`,
      }
    })
  }

  const availableFYs = getAvailableFYs()

  const handleDownload80GForFY = (fy) => {
    setFyDropdownOpen(false)
    if (kycDetails?.status !== 'verified') {
      alert("KYC verification is required to download a valid 80G acknowledgement. Please complete your KYC in the Profile section.")
      return
    }
    handleDownloadConsolidated(true, fy.startDate, fy.endDate, fy.label)
  }

  // ── Invoice filters ──────────────────────────────────────────────────────
  const [invoiceFilters, setInvoiceFilters] = useState({
    search: "",
    donationType: "all",
    dateFilter: "all",
    customStartDate: "",
    customEndDate: ""
  })

  const { data: myDonationsData, isLoading, isFetching } = useFetchMyDonationsQuery({
    page: currentPage,
    limit: 5,
    ...invoiceFilters
  })

  const donations = myDonationsData?.donations || []
  const pagination = myDonationsData?.pagination || { currentPage: 1, totalPages: 1, totalDonations: 0 }
  const stats = myDonationsData?.stats || { totalFilteredAmount: 0, total80GAmount: 0, eligibleDonationsCount: 0 }
  const kycDetails = myDonationsData?.kycDetails || null

  const [showCustomDateRange, setShowCustomDateRange] = useState(false)

  const quickDateFilters = [
    { value: "all", label: "All Time" },
    { value: "last-month", label: "Last Month" },
    { value: "last-3-months", label: "Last 3 Months" },
    { value: "last-6-months", label: "Last 6 Months" },
    { value: "last-year", label: "Last Financial Year" },
    { value: "current-year", label: "Current Financial Year" },
    { value: "custom", label: "Custom Range" }
  ]

  // ── Helper: image → base64 for jsPDF ────────────────────────────────────
  const getLogoDataUrl = (url) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        resolve({ dataUrl: canvas.toDataURL('image/png'), width: img.width, height: img.height })
      }
      img.onerror = () => resolve(null)
      img.src = url
    })
  }

  // ── Individual PDF (invoice or 80G ack) ─────────────────────────────────
  const handleDownloadIndividual = async (txn, is80G) => {
    if (is80G && kycDetails?.status !== 'verified') {
      alert("KYC verification is required to download a valid 80G tax receipt. Please complete your KYC in the Profile section and wait for admin approval (usually within 24 working hours).")
      return
    }

    const doc = new jsPDF()
    const name = userInfo?.fullName || "Valued Donor"
    const date = new Date(txn.date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })

    const logoData = await getLogoDataUrl('/TPFAid-Logo.png')
    if (logoData) {
      doc.addImage(logoData.dataUrl, 'PNG', 15, 15, 50, 15)
    } else {
      doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(16, 185, 129)
      doc.text("TPF Aid", 15, 25)
    }

    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(80, 80, 80)
    doc.text([
      "True Path Foundation",
      "229A, DDA LIG, Pocket - 12, Jasola,",
      "New Delhi, Delhi - 110025. www.truepathfoundation.in",
      "| support@tpfaid.org | (+91) 94 115 65185"
    ], 200, 18, { align: "right" })

    doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.setTextColor(40, 40, 40)
    const docTitle = is80G ? "Acknowledgement of Payment" : "Donation Payment Invoice"
    doc.text(docTitle, 15, 50)
    doc.setDrawColor(245, 158, 11); doc.setLineWidth(1)
    doc.line(15, 52, 15 + doc.getTextWidth(docTitle), 52)

    if (is80G) {
      doc.setFillColor(236, 253, 245); doc.roundedRect(150, 44, 45, 8, 1, 1, 'F')
      doc.setTextColor(5, 150, 105); doc.setFont("helvetica", "bold"); doc.setFontSize(9)
      doc.text("80G Tax Benefit Eligible", 172.5, 49.5, { align: "center" })
    }

    let startY = 65
    const lineHeight = 7
    doc.setFontSize(10); doc.setTextColor(0, 0, 0)

    const addField = (label, value, y) => {
      doc.setFont("helvetica", "bold"); doc.text(label, 15, y)
      doc.setFont("helvetica", "normal"); doc.text(String(value), 55, y)
    }

    addField("Receipt Number:", is80G ? txn.id : `INV-${txn.id}`, startY)
    addField("Payment Mode:", txn.paymentMode || "Online", startY + lineHeight)
    startY += 20

    if (is80G && kycDetails?.status === 'verified') {
      addField("Donor PAN:", kycDetails.panNumber || "N/A", startY)
      addField("City:", kycDetails.city || "N/A", startY + lineHeight)
      addField("State:", kycDetails.state || "N/A", startY + lineHeight * 2)
      addField("Donation Date:", date, startY + lineHeight * 3)
      startY += lineHeight * 3
    } else {
      addField("Donor Name:", name, startY)
      if (kycDetails) {
        addField("City:", kycDetails.city || "N/A", startY + lineHeight)
        addField("State:", kycDetails.state || "N/A", startY + lineHeight * 2)
        addField("Donation Date:", date, startY + lineHeight * 3)
        startY += lineHeight * 3
      } else {
        addField("Donation Date:", date, startY + lineHeight)
        startY += lineHeight
      }
    }

    doc.setFont("helvetica", "bold"); doc.text("Donation To:", 15, startY + lineHeight * 2)
    doc.setFont("helvetica", "normal")
    const causeTitle = txn.recipient || txn.cause || "General Donation"
    const splitCause = doc.splitTextToSize(causeTitle, 140)
    doc.text(splitCause, 55, startY + lineHeight * 2)

    const causeHeight = splitCause.length * lineHeight
    let currentY = startY + lineHeight * 2 + Math.max(lineHeight, causeHeight)

    addField("Fundraiser Type:", txn.cause || "General Charity", currentY)
    addField("Fundraiser Owner:", txn.beneficiaryName || txn.campaignerName || "True Path Foundation", currentY + lineHeight)
    currentY += 15
    addField("Donation Amount:", `INR ${txn.amount.toLocaleString('en-IN')}`, currentY)
    addField("Transaction ID:", txn.id, currentY + lineHeight)
    addField("Order Date:", date, currentY + lineHeight * 2)

    const drawProfessionalButton = (x, y, w, h, text, rgb, url) => {
      doc.setFillColor(220, 220, 220); doc.roundedRect(x + 0.4, y + 0.4, w, h, 1, 1, 'F')
      doc.setFillColor(rgb[0], rgb[1], rgb[2]); doc.roundedRect(x, y, w, h, 1, 1, 'F')
      doc.setTextColor(255, 255, 255); doc.setFontSize(8); doc.setFont("helvetica", "bold")
      doc.text(text, x + (w / 2), y + (h / 2) + 1, { align: "center" })
      if (url) doc.link(x, y, w, h, { url })
    }

    currentY += 25
    doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(40, 40, 40)
    const noteText = is80G
      ? "Note: You can download your 80G Receipt from the TPF portal. "
      : "Note: You can access all your receipts from the TPF portal. "
    doc.text(noteText, 15, currentY)
    drawProfessionalButton(15 + doc.getTextWidth(noteText) + 1, currentY - 5.5, 28, 8, "Click Here", [16, 185, 129], "https://www.tpfaid.org/profile/downloads")

    currentY += 8
    doc.setDrawColor(220, 220, 220); doc.setLineWidth(0.5); doc.line(15, currentY, 195, currentY)
    currentY += 12
    doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(60, 60, 60)
    const queryText = "For any further queries about your contribution, click "
    doc.text(queryText, 15, currentY)
    drawProfessionalButton(15 + doc.getTextWidth(queryText) + 1, currentY - 5.5, 32, 8, "Raise a Query", [59, 130, 246], "https://www.tpfaid.org/contactus")

    try {
      const bannerImgPath = txn.imageUrl ? getMediaUrl(txn.imageUrl) : '/funding.jpg'
      const campaignImageData = await getLogoDataUrl(bannerImgPath)
      if (campaignImageData) {
        let bannerY = currentY + 15
        if (bannerY + 60 > 290) { doc.addPage(); bannerY = 20 }
        doc.setFillColor(248, 250, 252); doc.roundedRect(15, bannerY, 180, 50, 2, 2, 'F')
        doc.setTextColor(30, 41, 59); doc.setFont("helvetica", "bold"); doc.setFontSize(16)
        doc.text((txn.cause === 'Healthcare' || txn.cause === 'Medical') ? "Be a Lifesaver" : "Support the Cause", 25, bannerY + 15)
        doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(71, 85, 105)
        doc.text("Your contribution makes a world of difference.", 25, bannerY + 22)
        doc.text("Share this story to help us reach our goal faster!", 25, bannerY + 27)
        const ctaX = 25, ctaY = bannerY + 34, ctaW = 45, ctaH = 10
        doc.setFillColor(220, 220, 220); doc.roundedRect(ctaX + 0.4, ctaY + 0.4, ctaW, ctaH, 1, 1, 'F')
        doc.setFillColor(16, 185, 129); doc.roundedRect(ctaX, ctaY, ctaW, ctaH, 1, 1, 'F')
        doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(10)
        doc.text("Spread the Word", ctaX + (ctaW / 2), ctaY + 6.5, { align: "center" })
        doc.link(ctaX, ctaY, ctaW, ctaH, { url: txn.slug ? `https://www.tpfaid.org/campaign/${txn.slug}` : 'https://www.tpfaid.org' })
        doc.setFillColor(255, 255, 255); doc.rect(130, bannerY + 5, 55, 40, 'F')
        doc.addImage(campaignImageData.dataUrl, 'JPEG', 131, bannerY + 6, 53, 38, undefined, 'FAST')
        currentY = bannerY + 50
      }
    } catch (err) { console.error("Impact banner image failed to load:", err) }

    currentY += 10
    if (currentY + 25 > 290) { doc.addPage(); currentY = 20 }
    doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(80, 80, 80)
    doc.text("Connect With Us", 105, currentY, { align: "center" })
    currentY += 8

    const socialIcons = [
      { name: 'Instagram', icon: '/instagram.png', url: 'https://www.instagram.com/tpf_aid?igsh=MTgyZG8weHdncmI1Yw==' },
      { name: 'Facebook', icon: '/facebook.png', url: 'https://www.facebook.com/share/17zgwH9Ma2/' },
      { name: 'Threads', icon: '/Threads.png', url: 'https://www.threads.net/@truepathfoundation' },
      { name: 'YouTube', icon: '/youtube.png', url: 'https://youtube.com/@tpfaid?si=P1WQRtDiBftO0uc3' }
    ]
    const iconSize = 8, spacing = 12
    let socX = (210 - (socialIcons.length * iconSize + (socialIcons.length - 1) * spacing)) / 2
    for (const soc of socialIcons) {
      const socData = await getLogoDataUrl(soc.icon)
      if (socData) { doc.addImage(socData.dataUrl, 'PNG', socX, currentY, iconSize, iconSize) }
      else { doc.setFontSize(7); doc.setTextColor(100, 100, 100); doc.text(soc.name, socX + iconSize / 2, currentY + iconSize / 2, { align: "center" }) }
      doc.link(socX, currentY, iconSize, iconSize, { url: soc.url })
      socX += iconSize + spacing
    }

    doc.setFontSize(8); doc.setTextColor(150, 150, 150); doc.setFont("helvetica", "italic")
    doc.text("This is a computer-generated document. No signature is required.", 105, 285, { align: "center" })
    doc.save(is80G ? `Acknowledgement_${txn.id}.pdf` : `Invoice_${txn.id}.pdf`)
  }

  // ── Consolidated PDF (all donations, or FY-scoped 80G) ──────────────────
  // fyStartDate / fyEndDate / fyLabel are only passed when called from the 80G FY dropdown
  const handleDownloadConsolidated = async (is80G, fyStartDate, fyEndDate, fyLabel) => {
    if (is80G && kycDetails?.status !== 'verified') {
      alert("KYC verification is required to download a valid 80G tax receipt. Please complete your KYC in the Profile section and wait for admin approval (usually within 24 working hours).")
      return
    }

    try {
      // Build query params:
      // – 80G download: use FY date range + show80GOnly so non-eligible donations are excluded
      // – Regular download: use whatever the user has filtered on screen
      const queryParams = new URLSearchParams({
        ...(fyStartDate
          ? { dateFilter: "custom", customStartDate: fyStartDate, customEndDate: fyEndDate }
          : { ...invoiceFilters }),
        download: "true",
        status: "SUCCESS",
        ...(is80G ? { show80GOnly: "true" } : {})
      })

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/donations/my-donations?${queryParams.toString()}`,
        { credentials: "include" }
      )
      const data = await response.json()

      if (!data.success || data.donations.length === 0) {
        alert("No donations found to download.")
        return
      }

      const donorName = userInfo?.fullName || "Valued Donor"
      const doc = new jsPDF()

      const logoData = await getLogoDataUrl('/TPFAid-Logo.png')
      const fallbackBannerData = await getLogoDataUrl('/funding.jpg')

      if (logoData) {
        doc.addImage(logoData.dataUrl, 'PNG', 15, 15, 50, 15)
      } else {
        doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(16, 185, 129)
        doc.text("TPF Aid", 15, 25)
      }

      doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(80, 80, 80)
      doc.text([
        "True Path Foundation",
        "PAN: AAJCT1092M | 80G: AAJCT1092MF2023101",
        "229A, DDA LIG, Pocket - 12, Jasola,",
        "New Delhi, Delhi - 110025. www.truepathfoundation.in",
        "| support@tpfaid.org | (+91) 94 115 65185"
      ], 200, 18, { align: "right" })

      // Title — include FY label when this is a FY-scoped 80G download
      doc.setFont("helvetica", "bold"); doc.setFontSize(15); doc.setTextColor(40, 40, 40)
      const titleStr = is80G
        ? `80G Tax Benefit Acknowledgement ${fyLabel ? `(${fyLabel})` : "(Consolidated)"}`
        : "Donation Payment Receipt & Invoice (Consolidated)"
      doc.text(titleStr, 15, 48)
      doc.setDrawColor(245, 158, 11); doc.setLineWidth(1)
      doc.line(15, 50, 15 + doc.getTextWidth(titleStr), 50)

      if (is80G) {
        doc.setFillColor(236, 253, 245); doc.roundedRect(150, 42, 45, 8, 1, 1, 'F')
        doc.setTextColor(5, 150, 105); doc.setFont("helvetica", "bold"); doc.setFontSize(9)
        doc.text("80G Tax Benefit Eligible", 172.5, 47.5, { align: "center" })
      }

      let startY = 62
      const lineHeight = 6
      doc.setFontSize(9); doc.setTextColor(0, 0, 0)

      const addField = (label, value, y) => {
        doc.setFont("helvetica", "bold"); doc.text(label, 15, y)
        doc.setFont("helvetica", "normal"); doc.text(String(value), 55, y)
      }

      addField("Donor Name:", donorName, startY)
      if (is80G && kycDetails) {
        addField("Donor PAN:", kycDetails.panNumber || "N/A", startY + lineHeight)
        addField("City:", kycDetails.city || "N/A", startY + lineHeight * 2)
        addField("State:", kycDetails.state || "N/A", startY + lineHeight * 3)
        startY += lineHeight * 3
      } else {
        addField("City:", kycDetails?.city || "N/A", startY + lineHeight)
        addField("State:", kycDetails?.state || "N/A", startY + lineHeight * 2)
        startY += lineHeight * 2
      }

      const dates = data.donations.map(d => new Date(d.date).getTime())
      const minDate = new Date(Math.min(...dates)).toLocaleDateString('en-IN')
      const maxDate = new Date(Math.max(...dates)).toLocaleDateString('en-IN')
      const totalAmount = data.donations.reduce((sum, d) => sum + d.amount, 0)

      addField("Date Range:", `${minDate} to ${maxDate}`, startY + lineHeight)
      addField("Total Contributions:", `${data.donations.length} Donations`, startY + lineHeight * 2)
      addField("Total Amount Paid:", `INR ${totalAmount.toLocaleString('en-IN')}`, startY + lineHeight * 3)
      startY += lineHeight * 4 + 4

      autoTable(doc, {
        startY,
        head: [['Date', 'Fundraiser / Recipient', 'Type', 'Payment Mode', 'Amount']],
        body: data.donations.map((d) => [
          new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          d.recipient || d.cause || "General Charity",
          d.donationType ? d.donationType.toUpperCase() : "N/A",
          d.paymentMode || "Online",
          `INR ${d.amount.toLocaleString('en-IN')}`
        ]),
        theme: 'plain',
        tableWidth: 170,
        margin: { left: 15, right: 25 },
        headStyles: { fillColor: [5, 150, 105], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5, cellPadding: { top: 3, bottom: 3, left: 3, right: 3 } },
        alternateRowStyles: { fillColor: [240, 253, 244] },
        styles: { fontSize: 8, textColor: [30, 41, 59], cellPadding: { top: 2.5, bottom: 2.5, left: 3, right: 3 }, font: 'helvetica', lineColor: [226, 232, 240], lineWidth: 0.1 },
        columnStyles: {
          0: { cellWidth: 30 }, 1: { cellWidth: 65 }, 2: { cellWidth: 25 }, 3: { cellWidth: 25 },
          4: { cellWidth: 25, halign: 'right', fontStyle: 'bold' }
        },
        didParseCell(d) { if (d.section === 'head' && d.column.index === 4) d.cell.styles.halign = 'right' }
      })

      let currentY = doc.lastAutoTable.finalY + 8

      try {
        const campaignImageData = await getLogoDataUrl('/funding.jpg')
        const finalBannerImg = campaignImageData || fallbackBannerData
        if (finalBannerImg && currentY + 35 <= 270) {
          doc.setFillColor(248, 250, 252); doc.roundedRect(15, currentY, 180, 32, 2, 2, 'F')
          doc.setTextColor(30, 41, 59); doc.setFont("helvetica", "bold"); doc.setFontSize(11)
          doc.text("Support the Cause & Be a Lifesaver", 22, currentY + 10)
          doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(71, 85, 105)
          doc.text("Your contribution makes a world of difference.", 22, currentY + 16)
          doc.text("Share this story to help us reach our goal faster!", 22, currentY + 20)
          doc.setFillColor(255, 255, 255); doc.rect(140, currentY + 4, 45, 24, 'F')
          doc.addImage(finalBannerImg.dataUrl, 'JPEG', 141, currentY + 5, 43, 22, undefined, 'FAST')
          currentY += 36
        }
      } catch (err) { console.error("Impact banner failed in consolidated PDF:", err) }

      if (currentY + 15 <= 280) {
        currentY += 4
        doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(80, 80, 80)
        doc.text("Connect With Us", 105, currentY, { align: "center" })
        currentY += 5
        const socialIcons = [
          { name: 'Instagram', icon: '/instagram.png', url: 'https://www.instagram.com/tpf_aid?igsh=MTgyZG8weHdncmI1Yw==' },
          { name: 'Facebook', icon: '/facebook.png', url: 'https://www.facebook.com/share/17zgwH9Ma2/' },
          { name: 'Threads', icon: '/Threads.png', url: 'https://www.threads.net/@truepathfoundation' },
          { name: 'YouTube', icon: '/youtube.png', url: 'https://youtube.com/@tpfaid?si=P1WQRtDiBftO0uc3' }
        ]
        const iconSize = 6, spacing = 10
        let socX = (210 - (socialIcons.length * iconSize + (socialIcons.length - 1) * spacing)) / 2
        for (const soc of socialIcons) {
          const socData = await getLogoDataUrl(soc.icon)
          if (socData) { doc.addImage(socData.dataUrl, 'PNG', socX, currentY, iconSize, iconSize); doc.link(socX, currentY, iconSize, iconSize, { url: soc.url }) }
          socX += iconSize + spacing
        }
      }

      doc.setFontSize(7); doc.setTextColor(150, 150, 150); doc.setFont("helvetica", "italic")
      doc.text("This is a computer-generated consolidated document. No signature is required.", 105, 288, { align: "center" })

      // Filename includes FY label when applicable
      const filename = is80G
        ? `80G_Acknowledgement_${fyLabel ? fyLabel.replace(/\s+/g, '_') + '_' : ''}${donorName.replace(/\s+/g, '_')}.pdf`
        : `Consolidated_Invoice_${donorName.replace(/\s+/g, '_')}.pdf`
      doc.save(filename)

    } catch (error) {
      console.error("Consolidated PDF Generation failed:", error)
      alert("Failed to generate consolidated PDF. Please try again.")
    }
  }

  // ── Certificate ──────────────────────────────────────────────────────────
  const handleDownloadCertificate = async (currentTxn) => {
    const lastDate = stats?.lastDonationDate || currentTxn.date
    const dateStr = new Date(lastDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
    
    const toTitleCase = (str) => {
      if (!str) return "";
      return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    const name = toTitleCase(userInfo?.fullName || "VALUED DONOR")

    try {
      const templateData = await getLogoDataUrl('/Certificate_Of_Achievement.jpg')
      if (templateData) {
        doc.addImage(templateData.dataUrl, 'JPEG', 0, 0, 297, 210)
      } else {
        doc.setDrawColor(16, 185, 129); doc.setLineWidth(1); doc.rect(5, 5, 287, 200)
      }

      // Name above the green line (Times-Italic, Title Case, dark charcoal)
      doc.setFont("times", "italic")
      doc.setFontSize(28)
      doc.setTextColor(44, 62, 80)
      doc.text(name, 148.5, 93.8, { align: "center" })

      // Date on the blank line (Helvetica-Bold, dark charcoal)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(14)
      doc.setTextColor(44, 62, 80)
      doc.text(dateStr, 90, 116.4, { align: "center" })

      doc.save(`Appreciation_Certificate_${name.replace(/\s+/g, '_')}.pdf`)
    } catch (error) {
      console.error("Certificate generation failed:", error)
      alert("Failed to generate certificate. Please check if the template image exists.")
    }
  }

  // ── Misc helpers ─────────────────────────────────────────────────────────
  const resetFilters = () => {
    setInvoiceFilters({ search: "", donationType: "all", dateFilter: "all", customStartDate: "", customEndDate: "" })
    setCurrentPage(1)
    setShowCustomDateRange(false)
  }

  const getTypeColor = (color) => {
    const colors = {
      blue: darkMode ? "text-blue-400" : "text-blue-600",
      emerald: darkMode ? "text-emerald-400" : "text-emerald-600",
      purple: darkMode ? "text-purple-400" : "text-purple-600",
      orange: darkMode ? "text-orange-400" : "text-orange-600",
      green: darkMode ? "text-green-400" : "text-green-600",
      red: darkMode ? "text-red-400" : "text-red-600"
    }
    return colors[color] || colors.emerald
  }

  const getTypeBg = (color) => {
    const colors = {
      blue: darkMode ? "bg-blue-500/20" : "bg-blue-100",
      emerald: darkMode ? "bg-emerald-500/20" : "bg-emerald-100",
      purple: darkMode ? "bg-purple-500/20" : "bg-purple-100",
      orange: darkMode ? "bg-orange-500/20" : "bg-orange-100",
      green: darkMode ? "bg-green-500/20" : "bg-green-100",
      red: darkMode ? "bg-red-500/20" : "bg-red-100"
    }
    return colors[color] || colors.emerald
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={`relative ${darkMode ? "bg-zinc-900" : "bg-transparent"}`}>
      {/* Background Pattern */}
      <div className="absolute inset-y-0 left-0 right-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute inset-0 ${darkMode
            ? "bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)]"
            : "bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)]"
            }`}
          style={{ backgroundSize: '48px 48px' }}
        />
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 lg:pb-24">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center mb-4 sm:mb-6"
          >
            <div className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl ${darkMode
              ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30"
              : "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-xl"
              }`}>
              <Download className={`w-12 h-12 sm:w-16 sm:h-16 ${darkMode ? "text-emerald-400" : "text-white"}`} />
            </div>
          </motion.div>

          <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Downloads &{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Receipts
            </span>
          </h1>
          <p className={`text-base sm:text-lg lg:text-xl max-w-3xl mx-auto px-4 ${darkMode ? "text-zinc-400" : "text-gray-600"}`}>
            Access your Form 10BE certificates and transaction invoices anytime
          </p>
        </motion.div>

        {/* Transaction Invoices Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className={`rounded-xl sm:rounded-2xl border overflow-hidden ${darkMode
            ? "bg-zinc-800/50 border-zinc-700"
            : "bg-white border-gray-200 shadow-lg"
            }`}>
            <div className={`p-4 sm:p-6 border-b ${darkMode ? "border-zinc-700" : "border-gray-200"}`}>

              {/* Section header + action buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-blue-500/20" : "bg-blue-100"}`}>
                    <Receipt className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold truncate ${darkMode ? "text-white" : "text-gray-900"}`}>
                      Transaction Invoices
                    </h2>
                    <p className={`text-xs sm:text-sm ${darkMode ? "text-zinc-400" : "text-gray-600"}`}>
                      Download acknowledgement for your donations
                    </p>
                  </div>
                </div>

                {pagination.totalDonations > 0 && (
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

                    {/* 80G FY dropdown — KYC-verified users only */}
                    {kycDetails?.status === 'verified' && (
                      <div className="relative">
                        <button
                          onClick={() => setFyDropdownOpen(!fyDropdownOpen)}
                          className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl cursor-pointer font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2 ${darkMode
                            ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                            }`}
                        >
                          <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                          80G Acknowledgement
                          <ChevronRight className={`w-4 h-4 transition-transform ${fyDropdownOpen ? "rotate-90" : ""}`} />
                        </button>

                        {fyDropdownOpen && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setFyDropdownOpen(false)} />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -8 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ duration: 0.15 }}
                              className={`absolute left-0 mt-2 w-64 rounded-xl shadow-xl z-40 border overflow-hidden ${darkMode
                                ? "bg-zinc-800 border-zinc-700"
                                : "bg-white border-gray-100"
                                }`}
                            >
                              <div className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wide border-b ${darkMode ? "text-zinc-400 border-zinc-700" : "text-gray-500 border-gray-100"}`}>
                                Select financial year
                              </div>

                              {availableFYs.map((fy) => (
                                <button
                                  key={fy.label}
                                  onClick={() => handleDownload80GForFY(fy)}
                                  className={`w-full text-left px-4 shadow-md hover:shadow-lg py-3 flex cursor-pointer items-center justify-between text-sm transition-all ${darkMode
                                    ? "hover:bg-zinc-700/60 text-zinc-300 hover:text-white"
                                    : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                                    }`}
                                >
                                  <span className="font-medium">{fy.label}</span>
                                 
                                </button>
                              ))}

                            
                            </motion.div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Download All (invoices, respects current filter) */}
                    <button
                      onClick={() => { setFyDropdownOpen(false); handleDownloadConsolidated(false) }}
                      className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl cursor-pointer font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2 ${darkMode
                        ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    >
                      <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                      Download All ({pagination.totalDonations})
                    </button>

                    {/* Appreciation Certificate */}
                    <button
                      onClick={() => { setFyDropdownOpen(false); handleDownloadCertificate(donations[0]) }}
                      disabled={!stats?.lastDonationDate}
                      className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2 ${darkMode
                        ? "bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 disabled:opacity-50"
                        : "bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50"
                        }`}
                    >
                      <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Download Certificate</span>
                      <span className="sm:hidden">Certificate</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Summary card */}
              <div className="grid grid-cols-1 mb-6">
                <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border ${darkMode ? "bg-zinc-900/50 border-zinc-700" : "bg-gray-50 border-gray-200"}`}>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? "text-zinc-400" : "text-gray-600"}`}>Filtered Total</p>
                  <p className={`text-xl sm:text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    ₹{stats.totalFilteredAmount.toLocaleString('en-IN')}
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? "text-zinc-500" : "text-gray-500"}`}>
                    {pagination.totalDonations} {pagination.totalDonations === 1 ? 'invoice' : 'invoices'}
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1 relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${darkMode ? "text-zinc-500" : "text-gray-400"}`} />
                    <input
                      type="text"
                      value={invoiceFilters.search}
                      onChange={(e) => setInvoiceFilters({ ...invoiceFilters, search: e.target.value })}
                      placeholder="Search..."
                      className={`w-full pl-9 sm:pl-11 pr-4 py-2.5 rounded-lg border outline-none transition-all text-sm sm:text-base ${darkMode
                        ? "bg-zinc-700 border-zinc-600 text-white placeholder-zinc-500 focus:border-emerald-500"
                        : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500"
                        }`}
                    />
                  </div>

                  <div className="relative">
                    <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${darkMode ? "text-zinc-500" : "text-gray-400"}`} />
                    <select
                      value={invoiceFilters.donationType}
                      onChange={(e) => { setInvoiceFilters({ ...invoiceFilters, donationType: e.target.value }); setCurrentPage(1) }}
                      className={`pl-9 sm:pl-11 pr-8 py-2.5 rounded-lg border outline-none transition-all appearance-none cursor-pointer text-sm sm:text-base ${darkMode
                        ? "bg-zinc-700 border-zinc-600 text-white focus:border-emerald-500"
                        : "bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500"
                        }`}
                    >
                      <option value="all">All Types</option>
                      <option value="zakat">Zakaat</option>
                      <option value="sadaqah">Sadaqah</option>
                      <option value="lillah">Lillah</option>
                      <option value="imdad">Imdaad</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {quickDateFilters.map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => {
                        setInvoiceFilters({ ...invoiceFilters, dateFilter: filter.value })
                        setCurrentPage(1)
                        setShowCustomDateRange(filter.value === "custom")
                      }}
                      className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all whitespace-nowrap ${invoiceFilters.dateFilter === filter.value
                        ? darkMode
                          ? "bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50"
                          : "bg-emerald-500 text-white border-2 border-emerald-600"
                        : darkMode
                          ? "bg-zinc-700 text-zinc-400 border-2 border-zinc-600 hover:border-emerald-500/50"
                          : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-emerald-500/50"
                        }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                  {(invoiceFilters.search || invoiceFilters.donationType !== "all" || invoiceFilters.dateFilter !== "all") && (
                    <button
                      onClick={resetFilters}
                      className="px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base border-2 border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {showCustomDateRange && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border ${darkMode ? "bg-zinc-900/50 border-zinc-700" : "bg-gray-50 border-gray-200"}`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className={`block text-xs sm:text-sm font-medium mb-2 ${darkMode ? "text-zinc-400" : "text-gray-700"}`}>Start Date</label>
                        <input
                          type="date"
                          value={invoiceFilters.customStartDate}
                          onChange={(e) => setInvoiceFilters({ ...invoiceFilters, customStartDate: e.target.value })}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border outline-none transition-all text-sm sm:text-base ${darkMode
                            ? "bg-zinc-700 border-zinc-600 text-white focus:border-emerald-500"
                            : "bg-white border-gray-200 text-gray-900 focus:border-emerald-500"
                            }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs sm:text-sm font-medium mb-2 ${darkMode ? "text-zinc-400" : "text-gray-700"}`}>End Date</label>
                        <input
                          type="date"
                          value={invoiceFilters.customEndDate}
                          onChange={(e) => setInvoiceFilters({ ...invoiceFilters, customEndDate: e.target.value })}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border outline-none transition-all text-sm sm:text-base ${darkMode
                            ? "bg-zinc-700 border-zinc-600 text-white focus:border-emerald-500"
                            : "bg-white border-gray-200 text-gray-900 focus:border-emerald-500"
                            }`}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Transaction list */}
            <div className={`divide-y relative ${darkMode ? "divide-zinc-800" : "divide-zinc-100"}`}>
              {(isLoading || isFetching) && (
                <div className={`absolute inset-0 z-20 flex items-center justify-center ${darkMode ? "bg-zinc-900/40" : "bg-white/40"} backdrop-blur-[2px]`}>
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                    <p className={`text-xs font-medium ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>Loading transactions...</p>
                  </div>
                </div>
              )}

              {donations.length === 0 && !isLoading && !isFetching ? (
                <div className="p-8 sm:p-12 text-center">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${darkMode ? "bg-zinc-700" : "bg-gray-100"}`}>
                    <FileCheck className={`w-6 h-6 sm:w-8 sm:h-8 ${darkMode ? "text-zinc-500" : "text-gray-400"}`} />
                  </div>
                  <p className={`text-base sm:text-lg font-medium mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>No invoices found</p>
                  <p className={`text-xs sm:text-sm ${darkMode ? "text-zinc-400" : "text-gray-600"}`}>Try adjusting your filters</p>
                </div>
              ) : (
                donations.map((txn, index) => (
                  <motion.div
                    key={txn.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`p-3 sm:p-4 lg:p-5 transition-all group ${darkMode ? "hover:bg-zinc-700/30" : "hover:bg-gray-50"}`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110 ${getTypeBg(txn.color)}`}>
                        <Wallet className={`w-5 h-5 sm:w-6 sm:h-6 ${getTypeColor(txn.color)}`} />
                      </div>

                      <div className="flex-1 min-w-0 w-full sm:w-auto">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className={`font-semibold text-sm sm:text-base truncate ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {txn.recipient}
                          </h3>
                          {(txn.taxEligible || kycDetails?.status === 'verified') && (
                            <div className={`px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 flex-shrink-0 ${darkMode ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-700"}`}>
                              <Shield className="w-3 h-3" />
                              80G
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeBg(txn.color)} ${getTypeColor(txn.color)}`}>
                            {txn.cause}
                          </span>
                          <span className={`text-xs ${darkMode ? "text-zinc-500" : "text-gray-500"}`}>•</span>
                          <span className={`text-xs capitalize ${darkMode ? "text-zinc-400" : "text-gray-600"}`}>{txn.donationType}</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs flex-wrap">
                          <Calendar className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${darkMode ? "text-zinc-500" : "text-gray-400"}`} />
                          <span className={darkMode ? "text-zinc-500" : "text-gray-500"}>
                            {new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className={`hidden sm:inline ${darkMode ? "text-zinc-600" : "text-gray-400"}`}>•</span>
                          <span className={`hidden sm:inline ${darkMode ? "text-zinc-500" : "text-gray-500"}`}>ID: {txn.id}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-left sm:text-right">
                          <p className={`text-lg sm:text-xl font-bold ${getTypeColor(txn.color)}`}>
                            ₹{txn.amount.toLocaleString('en-IN')}
                          </p>
                          <p className={`text-xs ${darkMode ? "text-zinc-500" : "text-gray-500"}`}>
                            {txn.paymentMode || "Payment Mode"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 relative">
                          <button
                            onClick={() => setOpenDropdownId(openDropdownId === txn.id ? null : txn.id)}
                            title="Download Options"
                            className={`p-2.5 sm:p-3 rounded-lg transition-all flex-shrink-0 ${darkMode
                              ? "bg-zinc-700 hover:bg-emerald-500/20 text-zinc-400 hover:text-emerald-400"
                              : "bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-600"
                              }`}
                          >
                            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>

                          {openDropdownId === txn.id && (
                            <>
                              <div className="fixed inset-0 z-30" onClick={() => setOpenDropdownId(null)} />
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.15 }}
                                className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl z-40 border ${darkMode
                                  ? "bg-zinc-800 border-zinc-700 text-white"
                                  : "bg-white border-gray-100 text-gray-800"
                                  }`}
                              >
                                <div className="py-1 px-1">
                                  <button
                                    onClick={() => { handleDownloadIndividual(txn, false); setOpenDropdownId(null) }}
                                    className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-2 transition-all ${darkMode
                                      ? "hover:bg-zinc-700/50 text-zinc-300 hover:text-white"
                                      : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                                      }`}
                                  >
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    Download Invoice
                                  </button>
                                  <button
                                    onClick={() => { handleDownloadIndividual(txn, true); setOpenDropdownId(null) }}
                                    className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-2 transition-all ${darkMode
                                      ? "hover:bg-zinc-700/50 text-zinc-300 hover:text-white"
                                      : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                                      }`}
                                  >
                                    <Shield className="w-4 h-4 text-emerald-500" />
                                    Download 80G Ack
                                  </button>
                                </div>
                              </motion.div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className={`p-4 flex flex-col sm:flex-row items-center justify-between gap-4 ${darkMode ? "border-t border-zinc-800" : "border-t border-gray-100"}`}>
                  <p className={`text-sm ${darkMode ? "text-zinc-400" : "text-gray-600"}`}>
                    Showing{" "}
                    <span className="font-semibold text-emerald-500">{(pagination.currentPage - 1) * 5 + 1}</span>
                    {" "}to{" "}
                    <span className="font-semibold text-emerald-500">{Math.min(pagination.currentPage * 5, pagination.totalDonations)}</span>
                    {" "}of{" "}
                    <span className="font-semibold text-emerald-500">{pagination.totalDonations}</span> results
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={pagination.currentPage === 1 || isFetching}
                      className={`p-2 rounded-lg border transition-all ${darkMode
                        ? "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-50"
                        : "bg-white border-gray-200 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                        }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-1">
                      {[...Array(pagination.totalPages)].map((_, i) => {
                        const pageNum = i + 1
                        if (
                          pageNum === 1 ||
                          pageNum === pagination.totalPages ||
                          (pageNum >= pagination.currentPage - 1 && pageNum <= pagination.currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${pagination.currentPage === pageNum
                                ? "bg-emerald-500 text-white"
                                : darkMode ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                              {pageNum}
                            </button>
                          )
                        } else if (
                          (pageNum === 2 && pagination.currentPage > 3) ||
                          (pageNum === pagination.totalPages - 1 && pagination.currentPage < pagination.totalPages - 2)
                        ) {
                          return <span key={pageNum} className={darkMode ? "text-zinc-600" : "text-gray-400"}>...</span>
                        }
                        return null
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                      disabled={pagination.currentPage === pagination.totalPages || isFetching}
                      className={`p-2 rounded-lg border transition-all ${darkMode
                        ? "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-50"
                        : "bg-white border-gray-200 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                        }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className={`mt-6 sm:mt-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl ${darkMode
            ? "bg-gradient-to-br from-blue-900/30 to-emerald-900/30 border border-blue-700/30"
            : "bg-gradient-to-br from-blue-50 to-emerald-50 border border-blue-200"
            }`}
        >
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <div className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0 ${darkMode ? "bg-blue-500/20" : "bg-blue-100"}`}>
              <FileText className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
            </div>
            <div>
              <h3 className={`font-bold text-base sm:text-lg mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>Important Information</h3>
              <ul className={`space-y-1.5 sm:space-y-2 text-xs sm:text-sm ${darkMode ? "text-zinc-400" : "text-gray-600"}`}>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>All invoices are generated automatically upon successful donation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>80G acknowledgements are available for completed financial years only</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Keep these documents safe for tax filing purposes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>You can download your receipts anytime - they don't expire</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-6 sm:mt-8 px-4"
        >
          <p className={`text-xs sm:text-sm mb-2 ${darkMode ? "text-zinc-500" : "text-gray-500"}`}>
            Need help? Contact our support team for assistance.
          </p>
          <a href="/contactus" className={`text-xs sm:text-sm font-medium underline ${darkMode ? "text-emerald-400 hover:text-emerald-500" : "text-emerald-600 hover:text-emerald-700"}`}>
            Visit Support Center
          </a>
        </motion.div>
      </div>
    </div>
  )
}