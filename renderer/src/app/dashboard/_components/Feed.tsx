// FEED
// /Users/matthewsimon/Documents/Github/electron-nextjs/renderer/src/app/dashboard/_components/Feed.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useFeedStore } from "@/store/feedStore";
import { useConvexUser } from "@/hooks/useConvexUser";
import { formatDistanceToNow } from "date-fns";
import { 
  Loader2,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Info,
  FileEdit,
  AlertCircle,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CommentSection } from "./CommentSection";
import FeedFooter from "./FeedFooter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TagSelector, TagBadge, Tag, TagColors } from "./Tags";

// Define Comment type locally to reduce dependencies
type Comment = {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  content: string;
  createdAt: Date;
};

interface FeedProps {
  /** Callback when tags are updated (added/removed) */
  onTagsUpdate?: (tags: Tag[]) => void;
}

export default function Feed({ onTagsUpdate }: FeedProps) {
  console.log("Feed component mounting/rendering");
  
  const {
    selectedDate,
    setFeedMessages,
    feedMessages,
    loading,
    setLoading,
    activeTab,
    setActiveTab,
  } = useFeedStore();
  
  console.log("Feed store state:", {
    selectedDate,
    activeTab,
    hasMessages: feedMessages ? feedMessages.length : 0,
    loading
  });

  // State for feedback
  const [feedbackStatus, setFeedbackStatus] = useState<Record<string, "liked" | "disliked" | null>>({});
  // We'll set these once we have a filtered message
  const [feedId, setFeedId] = useState<string | null>(null);
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  
  // New: Tag state
  const [feedTags, setFeedTags] = useState<Record<string, Tag[]>>({});
  const [allTags, setAllTags] = useState<Tag[]>([]);

  // Direct mutation to add a comment to a feed document
  const updateFeedWithComment = useMutation(api.feed.addComment);
  
  // New: Add tag mutation
  const addTagToFeed = useMutation(api.feed.addTag);
  const removeTagFromFeed = useMutation(api.feed.removeTag);

  // New: feedback mutation
  const submitFeedback = useMutation(api.feedback.submitFeedback);

  /* ───────────────────────────────────────────── */
  /* 1 Resolve the current user's stable ID        */
  /* ───────────────────────────────────────────── */
  const { isAuthenticated, isLoading: userLoading, userId } = useConvexUser();
  
  console.log("User data:", { 
    userId, 
    userLoading, 
    isAuthenticated 
  });

  /* ───────────────────────────────────────────── */
  /* 2 Query feed messages for that user           */
  /* ───────────────────────────────────────────── */
  const feedMessagesData = useQuery(
    api.feed.listFeedMessages,
    userId ? { userId } : "skip" // Skip query when userId is not available
  );
  
  console.log("Feed API response:", { 
    feedMessagesCount: feedMessagesData?.length || 0,
    feedMessagesData: feedMessagesData || "No data" 
  });

  /* ───────────────────────────────────────────── */
  /* 3 Check if daily log exists for this date     */
  /* ───────────────────────────────────────────── */
  const dailyLog = useQuery(
    api.dailyLogs.getDailyLog,
    userId && selectedDate ? { userId, date: selectedDate } : "skip"
  );

  // Debugging: Get all logs for this user to compare
  const allUserLogs = useQuery(
    api.dailyLogs.listAllUserLogs,
    userId ? { userId } : "skip"
  );

  const hasLogForDate = !!dailyLog;
  
  console.log("Daily log check:", {
    selectedDate,
    hasLog: hasLogForDate,
    userId: userId,
    userIdType: typeof userId,
    query: userId && selectedDate ? { userId, date: selectedDate } : "skip",
    dailyLogResponse: dailyLog
  });

  // Log all user logs for debugging
  console.log("All user logs:", {
    userId,
    count: allUserLogs?.length || 0,
    logs: allUserLogs || "No logs found"
  });

  /* ───────────────────────────────────────────── */
  /* 4 Action to (re)generate feed for a log       */
  /* ───────────────────────────────────────────── */
  const generateFeed = useAction(api.feed.generateFeedForDailyLog);
  
  // For debugging: Force reload
  const forceRefresh = () => {
    console.log("Force refreshing - current state:", {
      selectedDate,
      userId,
      hasLogForDate
    });
    
    // Reload the page
    window.location.reload();
  };

  /* ───────────────────────────────────────────── */
  /* 5 Sync Convex → feedStore when data arrives   */
  /* ───────────────────────────────────────────── */
  useEffect(() => {
    console.log("Feed API data changed:", feedMessagesData?.length || 0);
    if (feedMessagesData) {
      setFeedMessages(feedMessagesData);
    }
  }, [feedMessagesData, setFeedMessages]);

  /* ───────────────────────────────────────────── */
  /* 6 Helpers                                     */
  /* ───────────────────────────────────────────── */
  const filteredMessages =
    selectedDate && feedMessages
      ? feedMessages.filter((m) => {
          // Debug: log both values to compare
          console.log('Feed filter compare:', {messageDate: m.date, selectedDate});
          return m.date === selectedDate;
        })
      : [];
      
  console.log("Filtered messages:", {
    selectedDate,
    allMessagesCount: feedMessages?.length || 0,
    filteredCount: filteredMessages.length,
    filteredMessages
  });

  const handleGenerateFeed = async () => {
    if (!selectedDate || !userId) return;
    
    // Check if we have a daily log first
    if (!hasLogForDate) {
      console.error("Cannot generate feed: No daily log exists for this date");
      return;
    }
    
    setLoading(true);
    try {
      console.log("Generating feed for:", { userId, date: selectedDate });
      await generateFeed({ userId, date: selectedDate });
      console.log("Feed generated successfully");
    } catch (err) {
      console.error("Error generating feed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (messageId: string, isLiked: boolean) => {
    if (!userId) return;
    
    // Update local state immediately for responsive UI
    setFeedbackStatus(prev => ({
      ...prev,
      [messageId]: isLiked ? "liked" : "disliked"
    }));

    // Submit feedback to backend
    try {
      await submitFeedback({ 
        feedId: messageId as Id<"feed">,
        userId,
        isLiked,
      });
    } catch (err) {
      console.error("Error submitting feedback:", err);
      // Revert local state if submission fails
      setFeedbackStatus(prev => ({
        ...prev,
        [messageId]: null
      }));
    }
  };

  const handleCreateDailyLog = () => {
    // Switch to the log tab to create a log first
    setActiveTab("log");
  };

  // Query to get comments directly
  const fetchFeedComments = useQuery(
    api.feed.getComments,
    feedId ? { feedId: feedId as Id<"feed"> } : "skip"
  );

  // New: Query to get user's feedback for this feed item
  const userFeedback = useQuery(
    api.feedback.getUserFeedback,
    feedId && userId ? { feedId: feedId as Id<"feed">, userId } : "skip"
  );

  // Set the feed ID based on the selected message
  useEffect(() => {
    if (filteredMessages && filteredMessages.length > 0) {
      // Use the first message's ID for the selected date
      const messageId = filteredMessages[0]._id;
      console.log("Setting feed ID from filtered message:", messageId);
      setFeedId(messageId);
    } else {
      console.log("No filtered messages found, clearing feedId");
      setFeedId(null);
    }
  }, [filteredMessages]);

  // Load comments when feedId changes or when fetchFeedComments updates
  useEffect(() => {
    if (fetchFeedComments) {
      console.log("Got comments from backend:", fetchFeedComments);
      // Transform the data to match our Comment type
      const formattedComments = fetchFeedComments.map((comment: any, index: number) => ({
        id: `${feedId}_${index}`,
        userId: comment.userId,
        userName: comment.userName,
        userImage: comment.userImage,
        content: comment.content,
        createdAt: new Date(comment.createdAt)
      }));
      setComments(formattedComments);
      // Clear local comments since they should now be included in the fetched comments
      setLocalComments([]);
    }
  }, [fetchFeedComments, feedId]);

  // New: Update feedback status when userFeedback changes
  useEffect(() => {
    if (feedId && userFeedback) {
      setFeedbackStatus(prev => ({
        ...prev,
        [feedId]: userFeedback?.isLiked ? "liked" : "disliked"
      }));
    }
  }, [userFeedback, feedId]);

  // Optimistic add
  const handleAddComment = async (commentData: Omit<Comment, "id" | "createdAt">) => {
    console.log("Adding comment with feed ID:", feedId);
    if (!feedId) {
      console.error("Cannot add comment: No feed message available for the selected date");
      return;
    }
    
    // Create a temporary comment for optimistic UI update
    const tempComment: Comment = {
      ...commentData,
      id: `temp-${Date.now()}`,
      createdAt: new Date(),
    };
    
    // Update UI immediately
    setLocalComments((prev) => [...prev, tempComment]);
    
    try {
      // Simple, direct submission
      await updateFeedWithComment({ 
        feedId: feedId as Id<"feed">, 
        userId: commentData.userId,
        userName: commentData.userName,
        userImage: commentData.userImage,
        content: commentData.content
      });
      console.log("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  /* ───────────────────────────────────────────── */
  /* New: Tag handling functions                   */
  /* ───────────────────────────────────────────── */
  const handleAddTag = async (messageId: string, tag: Tag) => {
    if (!userId) return;
    
    // Optimistic update
    setFeedTags(prev => ({
      ...prev,
      [messageId]: [...(prev[messageId] || []), tag]
    }));
    
    // Update all tags collection for reuse
    if (!allTags.some(t => t.id === tag.id)) {
      setAllTags(prev => [...prev, tag]);
    }
    
    try {
      // Call the backend mutation
      await addTagToFeed({
        feedId: messageId as Id<"feed">,
        userId,
        tagId: tag.id,
        tagName: tag.name,
        tagColor: tag.color
      });
      
      // Notify parent of tag updates
      if (onTagsUpdate) {
        onTagsUpdate([...allTags, tag].filter((value, index, self) => 
          index === self.findIndex(t => t.id === value.id)
        ));
      }
    } catch (err) {
      console.error("Error adding tag:", err);
      // Revert on error
      setFeedTags(prev => ({
        ...prev,
        [messageId]: (prev[messageId] || []).filter(t => t.id !== tag.id)
      }));
    }
  };
  
  const handleRemoveTag = async (messageId: string, tagId: string) => {
    if (!userId) return;
    
    // Find the tag being removed for possible rollback
    const tagBeingRemoved = allTags.find(t => t.id === tagId);
    
    // Optimistic update
    setFeedTags(prev => ({
      ...prev,
      [messageId]: (prev[messageId] || []).filter(t => t.id !== tagId)
    }));
    
    try {
      // Call the backend mutation
      await removeTagFromFeed({
        feedId: messageId as Id<"feed">,
        userId,
        tagId
      });
      
      // We don't remove the tag from allTags since it might be used elsewhere
      // But we can notify parent of the current tag list
      if (onTagsUpdate) {
        onTagsUpdate(allTags);
      }
    } catch (err) {
      console.error("Error removing tag:", err);
      // Restore on error
      if (tagBeingRemoved) {
        setFeedTags(prev => ({
          ...prev,
          [messageId]: [...(prev[messageId] || []), tagBeingRemoved]
        }));
      }
    }
  };

  // New: Query to get tags for feed messages
  const feedTagsQuery = useQuery(
    api.feed.getFeedTags,
    userId ? { userId } : "skip"
  );
  
  // Add a ref to hold the latest onTagsUpdate
  const onTagsUpdateRef = useRef(onTagsUpdate);
  useEffect(() => {
    onTagsUpdateRef.current = onTagsUpdate;
  }, [onTagsUpdate]);

  // Load tags when data changes
  useEffect(() => {
    if (feedTagsQuery) {
      const tagsByFeedId: Record<string, Tag[]> = {};
      const allTagsList: Tag[] = [];
      feedTagsQuery.forEach((item: any) => {
        const feedId = item.feedId;
        if (!tagsByFeedId[feedId]) {
          tagsByFeedId[feedId] = [];
        }
        const tag: Tag = {
          id: item.tagId,
          name: item.tagName,
          color: item.tagColor as TagColors,
        };
        tagsByFeedId[feedId].push(tag);
        if (!allTagsList.some(t => t.id === tag.id)) {
          allTagsList.push(tag);
        }
      });
      setFeedTags(tagsByFeedId);
      setAllTags(allTagsList);
      // Use the ref to call the latest onTagsUpdate
      if (onTagsUpdateRef.current) {
        onTagsUpdateRef.current(allTagsList);
      }
    }
  }, [feedTagsQuery]);

  /* ───────────────────────────────────────────── */
  /* 7 Loading gate                                */
  /* ───────────────────────────────────────────── */
  if (userLoading || !userId) {
    console.log("Feed rendering loading state - user loading or no userId");
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  /* ───────────────────────────────────────────── */
  /* 8 Date selection required                     */
  /* ───────────────────────────────────────────── */
  if (!selectedDate) {
    console.log("Feed rendering no-date-selected state");
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="mb-4 p-3 rounded-full bg-gray-100">
          <Calendar className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-medium mb-2 text-gray-900">Select a date</h3>
        <p className="text-sm text-gray-600 max-w-xs">
          Choose a date from the calendar to view insights generated for that day&apos;s log.
        </p>
      </div>
    );
  }

  console.log("Feed rendering final state", {
    selectedDate,
    userId,
    feedMessagesCount: feedMessages?.length || 0,
    filteredCount: filteredMessages.length,
    activeTab,
    hasLogForDate
  });

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto p-4" style={{ height: 'calc(100vh - 64px - 56px)' }}>
        <div className="space-y-4">
          {/* daily summary */}
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <Card
                key={msg._id}
                className="transition-all duration-200 hover:shadow-md bg-white border-gray-200 shadow-sm"
              >
                <CardContent className="pt-4">
                  <div className="prose prose-zinc max-w-none text-gray-900">
                    <p>{msg.message}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col text-xs text-gray-600 pt-0">
                  <div className="flex justify-between w-full items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xs mr-2">Was this helpful?</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleFeedback(msg._id, true)}
                        className={cn(
                          "h-7 w-7 rounded-full",
                          feedbackStatus[msg._id] === "liked" && "bg-green-100 text-green-700"
                        )}
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleFeedback(msg._id, false)}
                        className={cn(
                          "h-7 w-7 rounded-full",
                          feedbackStatus[msg._id] === "disliked" && "bg-red-100 text-red-700"
                        )}
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center">
                      <Info className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(msg.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                  
                  {/* Tags row */}
                  <div className="w-full flex flex-wrap gap-2 mt-3 items-start">
                    {feedTags[msg._id]?.map((tag) => (
                      <TagBadge 
                        key={tag.id} 
                        tag={tag} 
                        onRemove={(tagId) => handleRemoveTag(msg._id, tagId)} 
                      />
                    ))}
                    
                    <TagSelector 
                      onTagSelected={(tag) => handleAddTag(msg._id, tag)} 
                      existingTags={allTags}
                    />
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : !hasLogForDate ? (
            // No daily log exists for this date
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="mb-6 p-4 rounded-full bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                <AlertCircle className="h-10 w-10 text-amber-600 dark:text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
                No Daily Log Yet
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mb-6 leading-relaxed">
                Start your day by creating a daily log for {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}.
              </p>
              
              <Button 
                onClick={handleCreateDailyLog}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg shadow-sm transition-all duration-200 flex items-center gap-2"
              >
                <FileEdit className="h-4 w-4" />
                Create Daily Log
              </Button>
              
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4">
                Switch to the Log tab to get started
              </p>
            </div>
          ) : (
            // Daily log exists but no feed yet
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="mb-6 p-4 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <RefreshCw className="h-10 w-10 text-blue-600 dark:text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
                Ready for Insights
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mb-6 leading-relaxed">
                Your daily log for {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })} is complete. Generate AI-powered insights to discover patterns and recommendations.
              </p>
              
              <Button 
                onClick={handleGenerateFeed} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg shadow-sm transition-all duration-200 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Generate Insights
                  </>
                )}
              </Button>
              
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4">
                This usually takes a few seconds
              </p>
            </div>
          )}

          {/* comments section */}
          {comments.length > 0 && (
            <div className="space-y-2 pb-10">
              {comments.map((comment) => (
                <Card key={comment.id} className="bg-white border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      {comment.userImage && (
                        <img
                          src={comment.userImage}
                          alt={comment.userName}
                          className="h-8 w-8 rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{comment.userName}</p>
                        <p className="text-sm text-gray-600">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-800">{comment.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <FeedFooter 
        onAddComment={handleAddComment} 
        hasFeed={feedMessages !== null && hasLogForDate}
      />
    </div>
  );
}