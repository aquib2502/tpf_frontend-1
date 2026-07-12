'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoginModal from '../login/LoginModal/MainModal';
import {
  Info,
  MessageCircle,
  FileText,
  Lock,
  Award,
  ChevronRight,
  Heart,
  Inbox,
  MessageSquare,
  Send,
  Loader2,
  Trash2,
  Check,
  Activity,
  User,
  Share2,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Linkedin,
  ExternalLink,
  X,
} from 'lucide-react';
import {
  useGetCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
} from '@/utils/slices/commentApiSlice';
import { getMediaUrl } from '@/utils/media';
import DOMPurify from 'dompurify';

export default function CampaignTabs({ darkMode, campaign }) {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingDocsAccess, setPendingDocsAccess] = useState(false);
  const [pendingCommentsAccess, setPendingCommentsAccess] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [previewDoc, setPreviewDoc] = useState(null);

  const [aboutExpanded, setAboutExpanded] = useState(false);
  const aboutText = campaign?.about || '';
  const ABOUT_CHAR_LIMIT = 700;
  const isAboutLong = aboutText.length > ABOUT_CHAR_LIMIT;
  const displayedAbout = isAboutLong && !aboutExpanded
    ? aboutText.slice(0, ABOUT_CHAR_LIMIT).trimEnd() + '…'
    : aboutText || 'No description provided.';

  const isAuthenticated = !!userInfo;

  const [commentPage, setCommentPage] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: commentsData, isLoading: commentsLoading, isFetching: commentsFetching } = useGetCommentsQuery({
    campaignId: campaign?._id,
    page: commentPage
  }, {
    skip: activeTab !== 'comments' || !campaign?._id,
  });

  const [addComment, { isLoading: isAdding }] = useAddCommentMutation();
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();

  const impactGoals = campaign?.impactGoals ?? [];
  const documents = campaign?.documents ?? [];
  // console.log("Campaign Data:", campaign);
  const socialMediaLinks = campaign?.socialMediaSubmissions?.[0]?.links || {};
  const hasSocialMedia = Object.values(socialMediaLinks).some(link => link && link.trim() !== '');

  const getSocialConfig = (platform) => {
    const configs = {
      instagram: {
        icon: Instagram,
        color: 'from-purple-500 to-pink-500',
        hoverColor: 'hover:border-purple-500/50',
        darkHoverColor: 'hover:border-purple-400/50',
        bgLight: 'bg-purple-50/30',
        bgDark: 'bg-purple-500/10',
        iconBgLight: 'bg-purple-100',
        iconBgDark: 'bg-purple-500/10',
        iconHoverLight: 'group-hover:bg-purple-200',
        iconHoverDark: 'group-hover:bg-purple-500/20',
        textLight: 'text-purple-600',
        textDark: 'text-purple-400'
      },
      facebook: {
        icon: Facebook,
        color: 'from-blue-600 to-blue-700',
        hoverColor: 'hover:border-blue-500/50',
        darkHoverColor: 'hover:border-blue-400/50',
        bgLight: 'bg-blue-50/30',
        bgDark: 'bg-blue-500/10',
        iconBgLight: 'bg-blue-100',
        iconBgDark: 'bg-blue-500/10',
        iconHoverLight: 'group-hover:bg-blue-200',
        iconHoverDark: 'group-hover:bg-blue-500/20',
        textLight: 'text-blue-600',
        textDark: 'text-blue-400'
      },
      youtube: {
        icon: Youtube,
        color: 'from-red-500 to-red-600',
        hoverColor: 'hover:border-red-500/50',
        darkHoverColor: 'hover:border-red-400/50',
        bgLight: 'bg-red-50/30',
        bgDark: 'bg-red-500/10',
        iconBgLight: 'bg-red-100',
        iconBgDark: 'bg-red-500/10',
        iconHoverLight: 'group-hover:bg-red-200',
        iconHoverDark: 'group-hover:bg-red-500/20',
        textLight: 'text-red-600',
        textDark: 'text-red-400'
      },
      twitter: {
        icon: Twitter,
        color: 'from-sky-400 to-sky-500',
        hoverColor: 'hover:border-sky-500/50',
        darkHoverColor: 'hover:border-sky-400/50',
        bgLight: 'bg-sky-50/30',
        bgDark: 'bg-sky-500/10',
        iconBgLight: 'bg-sky-100',
        iconBgDark: 'bg-sky-500/10',
        iconHoverLight: 'group-hover:bg-sky-200',
        iconHoverDark: 'group-hover:bg-sky-500/20',
        textLight: 'text-sky-600',
        textDark: 'text-sky-400'
      },
      linkedin: {
        icon: Linkedin,
        color: 'from-blue-600 to-blue-700',
        hoverColor: 'hover:border-blue-600/50',
        darkHoverColor: 'hover:border-blue-500/50',
        bgLight: 'bg-blue-50/30',
        bgDark: 'bg-blue-600/10',
        iconBgLight: 'bg-blue-100',
        iconBgDark: 'bg-blue-600/10',
        iconHoverLight: 'group-hover:bg-blue-200',
        iconHoverDark: 'group-hover:bg-blue-600/20',
        textLight: 'text-blue-700',
        textDark: 'text-blue-400'
      },
      other: {
        icon: ExternalLink,
        color: 'from-gray-500 to-gray-600',
        hoverColor: 'hover:border-gray-500/50',
        darkHoverColor: 'hover:border-gray-400/50',
        bgLight: 'bg-gray-50/30',
        bgDark: 'bg-gray-500/10',
        iconBgLight: 'bg-gray-100',
        iconBgDark: 'bg-gray-500/10',
        iconHoverLight: 'group-hover:bg-gray-200',
        iconHoverDark: 'group-hover:bg-gray-500/20',
        textLight: 'text-gray-600',
        textDark: 'text-gray-400'
      },
    };
    return configs[platform] || configs.other;
  };

  const getPlatformName = (platform) => {
    const names = {
      instagram: 'Instagram',
      facebook: 'Facebook',
      youtube: 'YouTube',
      twitter: 'Twitter',
      linkedin: 'LinkedIn',
      other: 'Website',
    };
    return names[platform] || platform;
  };

  const handleDocumentsLogin = () => {
    if (!userInfo) {
      setPendingDocsAccess(true);
      setPendingCommentsAccess(false);
      setShowLoginModal(true);
    }
    
  };

  const handleCommentsLogin = () => {
    if (!userInfo) {
      setPendingCommentsAccess(true);
      setPendingDocsAccess(false);
      setShowLoginModal(true);
    }
  };

  useEffect(() => {
    if (userInfo && (pendingDocsAccess || pendingCommentsAccess)) {
      setPendingDocsAccess(false);
      setPendingCommentsAccess(false);
      setShowLoginModal(false);
    }
  }, [userInfo, pendingDocsAccess, pendingCommentsAccess]);

  const handlePostComment = async () => {
    if (!userInfo) {
      handleCommentsLogin();
      return;
    }
    if (!newComment.trim()) return;
    try {
      await addComment({
        campaignId: campaign._id,
        content: newComment,
        isAnonymous
      }).unwrap();
      setNewComment('');
      setIsAnonymous(false);
      setCommentPage(1);
    } catch (err) {
      console.error("Failed to post comment:", err);
    }

  };

  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  const handleDelete = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteComment(deleteConfirm.id).unwrap();
      setDeleteConfirm({ show: false, id: null });
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  useEffect(() => {
    if (previewDoc) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [previewDoc]);

  return (
    <div className={`${darkMode ? 'bg-zinc-800' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden`}>
      {/* ---------------- TABS ---------------- */}
      <div className={`flex border-b ${darkMode ? 'border-zinc-700' : 'border-gray-200'}`}>
        {[
          { id: 'about', icon: Info, label: 'About' },
          { id: 'status', icon: Activity, label: 'Current Status' },
          { id: 'documents', icon: FileText, label: 'Documents', badge: documents.length },
          { id: 'comments', icon: MessageCircle, label: 'Comments', badge: commentsData?.data?.length || 0 },
        ].filter(tab => tab.id !== 'documents' || tab.badge > 0).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 px-2 sm:px-4 font-medium relative transition-colors
              ${activeTab === tab.id
                ? darkMode ? 'text-emerald-400' : 'text-emerald-600'
                : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] sm:text-sm">{tab.label}</span>

            {tab.badge > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-semibold">
                {tab.badge}
              </span>
            )}

            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500"
              />
            )}
          </button>
        ))}
      </div>

      {/* ---------------- TAB CONTENT ---------------- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`p-4 sm:p-6 md:p-8 ${(activeTab === 'documents' || activeTab === 'comments') ? 'min-h-[300px] sm:min-h-[400px]' : ''}`}
        >
          {/* ================= ABOUT TAB ================= */}
          {activeTab === 'about' && (
            <div className="space-y-8">

              {/* ── Social Proof Bar ── */}
              {hasSocialMedia && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className={`flex flex-wrap items-center gap-2.5 pb-5 border-b ${darkMode ? 'border-zinc-700' : 'border-gray-100'}`}
                >
                  <div className="flex items-center gap-1.5 mr-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className={`text-[11px] font-semibold uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Live on
                    </span>
                  </div>

                  {Object.entries(socialMediaLinks).map(([platform, url]) => {
                    if (!url || url.trim() === '' || platform === 'youtube') return null;
                    const config = getSocialConfig(platform);
                    const Icon = config.icon;
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={getPlatformName(platform)}
                        className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0
                ${darkMode
                            ? `bg-zinc-900/70 border-zinc-700 hover:border-zinc-500 ${config.textDark}`
                            : `bg-white border-gray-200 hover:border-gray-300 shadow-sm ${config.textLight}`
                          }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
                        <span>{getPlatformName(platform)}</span>
                      </a>
                    );
                  })}

                  <span className={`ml-auto text-[11px] hidden sm:flex items-center gap-1 shrink-0 ${darkMode ? 'text-zinc-600' : 'text-gray-400'}`}>
                    <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified presence
                  </span>
                </motion.div>
              )}

              <div>
                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  About This Campaign
                </h3>

                {campaign?.beneficiaryName && (
                  <div className="space-y-4 mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Campaigner Box */}
                      <div className={`group p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-zinc-900/50 border-zinc-700 hover:border-blue-500/50' : 'bg-blue-50/30 border-blue-100 hover:border-blue-300'}`}>
                        <div className="flex items-center gap-2 mb-2 sm:mb-3">
                          <div className={`p-1.5 sm:p-2 rounded-xl transition-colors ${darkMode ? 'bg-blue-500/10 group-hover:bg-blue-500/20' : 'bg-blue-100 group-hover:bg-blue-200'}`}>
                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                          </div>
                          <h4 className={`font-bold text-[10px] sm:text-xs uppercase tracking-widest ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            Campaigner
                          </h4>
                        </div>
                        <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {campaign.campaignerName || campaign.fullName}
                        </p>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Verified campaign organizer
                        </p>
                      </div>

                      {/* Beneficiary Box */}
                      <div className={`group p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-zinc-900/50 border-zinc-700 hover:border-emerald-500/50' : 'bg-emerald-50/30 border-emerald-100 hover:border-emerald-300'}`}>
                        <div className="flex items-center gap-2 mb-2 sm:mb-3">
                          <div className={`p-1.5 sm:p-2 rounded-xl transition-colors ${darkMode ? 'bg-emerald-500/10 group-hover:bg-emerald-500/20' : 'bg-emerald-100 group-hover:bg-emerald-200'}`}>
                            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                          </div>
                          <h4 className={`font-bold text-[10px] sm:text-xs uppercase tracking-widest ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                            Beneficiary
                          </h4>
                        </div>
                        <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {campaign.beneficiaryName}
                        </p>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          The primary recipient of this fund
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* About Text with Read More / Read Less */}
                <div>
                  <div className="relative">
                    <div
                      className={`whitespace-pre-line leading-relaxed text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      dangerouslySetInnerHTML={{
                        __html: typeof window !== 'undefined' ? DOMPurify.sanitize(displayedAbout) : displayedAbout
                      }}
                    />
                    {isAboutLong && !aboutExpanded && (
                      <div className={`absolute bottom-0 left-0 right-0 h-10 pointer-events-none ${darkMode ? 'bg-gradient-to-t from-zinc-800 to-transparent' : 'bg-gradient-to-t from-white to-transparent'}`} />
                    )}
                  </div>

                  {isAboutLong && (
                    <button
                      onClick={() => setAboutExpanded(prev => !prev)}
                      className={`mt-3 inline-flex items-center gap-1.5 text-sm font-semibold cursor-pointer transition-colors ${darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}`}
                    >
                      {aboutExpanded ? 'Read Less' : 'Read More'}
                      <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${aboutExpanded ? '-rotate-90' : 'rotate-90'}`} />
                    </button>
                  )}
                </div>
              </div>

              {/* Impact Goals */}
              {impactGoals.length > 0 && (
                <div className={`p-4 sm:p-6 rounded-xl ${darkMode ? 'bg-zinc-900 border border-zinc-700' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100'}`}>
                  <h4 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Award className="w-5 h-5 text-blue-500" />
                    Campaign Impact Goals
                  </h4>
                  <ul className="space-y-2">
                    {impactGoals.map((goal, i) => (
                      <li key={i} className={`flex items-start gap-3 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <ChevronRight className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {/* ================= DOCUMENTS TAB ================= */}
          {activeTab === 'documents' && (
            <div className="relative min-h-[350px] flex flex-col">
              <div className={`flex-1 ${!isAuthenticated ? 'opacity-40 blur-sm pointer-events-none' : ''}`}>
                {documents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`w-20 h-20 rounded-full mb-6 flex items-center justify-center ${darkMode ? 'bg-zinc-900' : 'bg-gray-100'}`}
                    >
                      <Inbox className={`w-10 h-10 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    </motion.div>
                    <h4 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      No Documents Yet
                    </h4>
                    <p className={`text-center max-w-md ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Supporting documents will be uploaded here as they become available.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-lg border transition-all hover:shadow-md
                          ${darkMode ? 'border-zinc-700 hover:border-emerald-500/50' : 'border-gray-200 hover:border-emerald-400'}`}
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div
                            onClick={() => setPreviewDoc(doc)}
                            className={`w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border shrink-0 bg-gray-50 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity ${
                              darkMode ? 'border-zinc-700 bg-zinc-800' : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            {doc.fileUrl && (doc.fileType?.toLowerCase() === 'pdf' || doc.fileUrl.toLowerCase().endsWith('.pdf')) ? (
                              <div className="flex flex-col items-center justify-center p-2 text-center h-full">
                                <FileText className="w-6 h-6 text-red-500 mb-1" />
                                <span className="text-[9px] font-bold text-gray-500 uppercase">PDF</span>
                              </div>
                            ) : (
                              <img
                                src={getMediaUrl(doc.fileUrl)}
                                alt={doc.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  const parent = e.target.parentElement;
                                  if (parent) {
                                    const fallback = document.createElement('div');
                                    fallback.className = 'flex flex-col items-center justify-center p-2 text-center h-full';
                                    fallback.innerHTML = `<svg class="w-6 h-6 text-emerald-500 mb-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg><span class="text-[9px] font-bold text-gray-500 uppercase">${doc.fileType?.toUpperCase() || 'DOC'}</span>`;
                                    parent.appendChild(fallback);
                                  }
                                }}
                              />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {doc.name}
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {doc.fileType?.toUpperCase()}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className={`w-full sm:w-auto shrink-0 px-4 py-2 rounded-lg font-medium transition-colors text-center ${darkMode
                            ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            }`}
                        >
                          View Document
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {!isAuthenticated && (
                <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md bg-black/40 rounded-xl">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4 mx-auto">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white font-semibold text-lg mb-2">Documents Locked</p>
                    <p className="text-white/80 text-sm mb-4 max-w-xs">
                      Sign in to access campaign documents and transparency reports
                    </p>
                    <button
                      onClick={handleDocumentsLogin}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-emerald-500/50 transition-all transform hover:scale-105"
                    >
                      Sign In to View
                    </button>
                  </motion.div>
                </div>
              )}
            </div>
          )}

          {/* ================= COMMENTS TAB ================= */}
          {activeTab === 'comments' && (
            <div className="relative min-h-[350px] flex flex-col">
              <div className={`flex-1 ${!isAuthenticated ? 'opacity-40 blur-sm pointer-events-none' : ''}`}>
                <div className="space-y-8">
                  {isAuthenticated && !commentsData?.userHasCommented && (
                    <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold">
                          {userInfo?.fullName?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className={`w-full bg-transparent border-0 focus:ring-0 outline-none p-0 text-base resize-none min-h-[60px] ${darkMode ? 'text-white placeholder-zinc-500' : 'text-gray-900 placeholder-gray-400'}`}
                            maxLength={1000}
                          />
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-gray-200/20">
                            <label className={`flex items-center gap-2 text-sm cursor-pointer select-none ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isAnonymous ? 'bg-emerald-500 border-emerald-500' : 'border-gray-400'}`}>
                                {isAnonymous && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} className="hidden" />
                              Comment as Anonymous
                            </label>
                            <button
                              onClick={handlePostComment}
                              disabled={!newComment.trim() || isAdding}
                              className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all
                                  ${!newComment.trim() ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-400' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                            >
                              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                              Post
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {isAuthenticated && commentsData?.userHasCommented && (
                    <div className={`p-4 rounded-xl border border-dashed text-center ${darkMode ? 'bg-zinc-900/30 border-zinc-700 text-zinc-400' : 'bg-gray-50/50 border-gray-200 text-gray-500'}`}>
                      <p className="text-sm">You have already shared your thoughts on this campaign. Thank you for your support!</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {commentsLoading && commentPage === 1 ? (
                      <div className="text-center py-10">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-500" />
                      </div>
                    ) : commentsData?.data?.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 px-4">
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className={`w-20 h-20 rounded-full mb-6 flex items-center justify-center ${darkMode ? 'bg-zinc-900' : 'bg-gray-100'}`}
                        >
                          <MessageSquare className={`w-10 h-10 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                        </motion.div>
                        <h4 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          No Comments Yet
                        </h4>
                        <p className={`text-center max-w-md ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          Be the first to share words of encouragement and support for this cause.
                        </p>
                      </div>
                    ) : (
                      <>
                        {(isExpanded ? commentsData?.data : commentsData?.data?.slice(0, 5)).map((comment) => (
                          <motion.div
                            key={comment._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-5 rounded-xl border-l-4 border-emerald-500 transition-all hover:shadow-md
                              ${darkMode ? 'bg-zinc-900 hover:bg-zinc-900/80' : 'bg-gray-50 hover:bg-gray-100/80'}`}
                          >
                            <div className="flex gap-4">
                              <div className={`w-12 h-12 rounded-full font-semibold flex items-center justify-center shrink-0
                                 ${comment.isAnonymous ? 'bg-gray-500' : 'bg-gradient-to-br from-emerald-500 to-teal-600'} text-white`}>
                                {comment.user?.fullName ? comment.user.fullName.charAt(0) : 'A'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                  <div>
                                    <span className={`font-semibold mr-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {comment.user?.fullName || 'Anonymous'}
                                      {comment.isOwner && comment.isAnonymous && <span className="opacity-50 ml-1">(You)</span>}
                                    </span>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                      {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                  </div>
                                  {comment.isOwner && (
                                    <button
                                      onClick={() => handleDelete(comment._id)}
                                      disabled={isDeleting}
                                      className={`p-2 rounded-xl transition-all duration-200 hover:scale-105
                                        ${darkMode
                                          ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20'
                                          : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'}`}
                                      title="Delete Comment"
                                    >
                                      {isDeleting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="w-4 h-4" />
                                      )}
                                    </button>
                                  )}
                                </div>
                                <p className={`whitespace-pre-wrap break-words ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        <div className="flex flex-col items-center gap-3 pt-2">
                          {(commentsData?.totalCount > 5 || commentsData?.data?.length > 5) && (
                            <button
                              onClick={() => setIsExpanded(!isExpanded)}
                              className={`text-sm font-semibold hover:underline ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}
                            >
                              {isExpanded ? 'Show Less Comments' : 'Show More Comments'}
                            </button>
                          )}
                          {isExpanded && commentsData?.hasMore && (
                            <button
                              onClick={() => setCommentPage(prev => prev + 1)}
                              disabled={commentsFetching}
                              className={`text-xs opacity-60 hover:opacity-100 flex items-center gap-1 ${darkMode ? 'text-white' : 'text-zinc-600'}`}
                            >
                              {commentsFetching ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                              Load Older Comments
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {!isAuthenticated && (
                <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md bg-black/40 rounded-xl">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4 mx-auto">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white font-semibold text-lg mb-2">Comments Locked</p>
                    <p className="text-white/80 text-sm mb-4 max-w-xs">
                      Sign in to read and post comments for this campaign
                    </p>
                    <button
                      onClick={handleCommentsLogin}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-emerald-500/50 transition-all transform hover:scale-105"
                    >
                      Sign In to Comment
                    </button>
                  </motion.div>
                </div>
              )}
            </div>
          )}

          {/* ================= CURRENT STATUS TAB ================= */}
          {activeTab === 'status' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                  <Activity className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Campaign Updates
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Timeline of updates from the ground
                  </p>
                </div>
              </div>

              {campaign?.statusHistory && campaign.statusHistory.length > 0 ? (
                <div className="relative">
                  {/* Timeline Line */}
                  <div className={`absolute left-6 top-0 bottom-0 w-0.5 ${darkMode ? 'bg-zinc-700' : 'bg-gray-200'}`} />

                  {/* Status Updates - Reverse chronological order */}
                  <div className="space-y-6">
                    {[...campaign.statusHistory].reverse().map((statusItem, index) => {
                      const isLatest = index === 0;
                      return (
                        <div key={index} className="relative pl-16">
                          {/* Timeline Dot */}
                          <div className={`absolute left-3.5 top-2 w-5 h-5 rounded-full border-4 ${isLatest
                              ? darkMode
                                ? 'bg-emerald-500 border-zinc-900'
                                : 'bg-emerald-500 border-white shadow-lg shadow-emerald-200'
                              : darkMode
                                ? 'bg-zinc-700 border-zinc-900'
                                : 'bg-gray-300 border-white'
                            }`} />

                          {/* Status Card */}
                          <div className={`p-5 rounded-2xl border transition-all ${isLatest
                              ? darkMode
                                ? 'bg-emerald-500/10 border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                                : 'bg-emerald-50 border-emerald-200 shadow-sm'
                              : darkMode
                                ? 'bg-zinc-900/50 border-zinc-700'
                                : 'bg-white border-gray-200'
                            }`}>
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                {isLatest && (
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${darkMode
                                      ? 'bg-emerald-500/20 text-emerald-400'
                                      : 'bg-emerald-100 text-emerald-700'
                                    }`}>
                                    Latest
                                  </span>
                                )}
                                <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                  {new Date(statusItem.createdAt).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {new Date(statusItem.createdAt).toLocaleTimeString('en-IN', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>

                            {/* Status Message */}
                            <p className={`whitespace-pre-line leading-relaxed ${isLatest
                                ? darkMode ? 'text-white' : 'text-gray-900'
                                : darkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                              {statusItem.status}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className={`p-6 rounded-2xl border ${darkMode
                    ? 'bg-zinc-900/50 border-zinc-700'
                    : 'bg-white border-gray-200 shadow-sm'
                  }`}>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center ${darkMode ? 'bg-zinc-800' : 'bg-gray-100'
                      }`}>
                      <Info className={`w-8 h-8 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    </div>
                    <p className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      No status updates have been posted yet.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        darkMode={darkMode}
        onLoginSuccess={() => setShowLoginModal(false)}
      />

      {/* ================= DOCUMENT PREVIEW MODAL ================= */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/90 flex flex-col z-[70]"
            onClick={() => setPreviewDoc(null)}
          >
            {/* Minimal top bar */}
            <div
              className="flex items-center justify-between px-5 py-3 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-white/60 text-sm truncate max-w-[80%]">
                {previewDoc.name}
              </span>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document fills remaining space */}
            <div
              className="flex-1 overflow-auto flex items-start justify-center px-4 pb-4"
              onClick={(e) => e.stopPropagation()}
            >
              {previewDoc.fileType?.toLowerCase() === 'pdf' ? (
                <iframe
                  src={`${getMediaUrl(previewDoc.fileUrl)}#toolbar=0&navpanes=0`}
                  className="w-full max-w-4xl h-[calc(100vh-60px)] rounded-sm"
                  title={previewDoc.name}
                />
              ) : (
                <motion.img
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  src={getMediaUrl(previewDoc.fileUrl)}
                  alt={previewDoc.name}
                  className="w-full max-w-4xl object-contain rounded-sm"
                  style={{ maxHeight: 'calc(100vh - 60px)' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/fallback-document.png';
                  }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      <AnimatePresence>
        {deleteConfirm.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4"
            onClick={() => setDeleteConfirm({ show: false, id: null })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-2xl p-6 w-full max-w-sm relative ${darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'}`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-4 rounded-full mb-4 ${darkMode ? 'bg-red-500/10' : 'bg-red-50'}`}>
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Delete Comment?
                </h3>
                <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  This action cannot be undone. Are you sure you want to remove your comment?
                </p>
                <div className="flex w-full gap-3">
                  <button
                    onClick={() => setDeleteConfirm({ show: false, id: null })}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-colors
                      ${darkMode
                        ? 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold flex justify-center items-center transition-opacity disabled:opacity-50"
                  >
                    {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
}