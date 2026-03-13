import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, MessageSquare, User, Quote } from "lucide-react";
import { ReviewReplyDialog } from "@/components/ratings/ReviewReplyDialog";
import { RatingStars } from "./RatingStars";
import { motion } from "framer-motion";

interface Review {
  customer: string;
  orders: number;
  rating: number;
  review: string;
  orderId: string;
  date: string;
}

interface RecentReviewsProps {
  reviews: Review[];
  totalReviews: number;
  reviewsChange: number;
}

export const RecentReviews = ({
  reviews,
  totalReviews,
  reviewsChange,
}: RecentReviewsProps) => {
  const [replyDialog, setReplyDialog] = useState<{
    isOpen: boolean;
    reviewIndex: number | null;
    customerName: string;
    reviewText: string;
  }>({
    isOpen: false,
    reviewIndex: null,
    customerName: "",
    reviewText: "",
  });
  const [reviewReplies, setReviewReplies] = useState<Record<number, string>>(
    {},
  );

  const handleReplyClick = (
    index: number,
    customerName: string,
    reviewText: string,
  ) => {
    setReplyDialog({
      isOpen: true,
      reviewIndex: index,
      customerName,
      reviewText,
    });
  };

  const handleReplySubmit = (reply: string) => {
    if (replyDialog.reviewIndex !== null) {
      setReviewReplies((prev) => ({
        ...prev,
        [replyDialog.reviewIndex!]: reply,
      }));
    }
  };

  const closeReplyDialog = () => {
    setReplyDialog({
      isOpen: false,
      reviewIndex: null,
      customerName: "",
      reviewText: "",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Card className="overflow-hidden border-border/50 bg-card shadow-elevated hover:shadow-elevated-lg transition-all duration-300">
        <CardHeader className="pb-4 bg-gradient-to-br from-info/5 via-transparent to-transparent">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-info to-info/80 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <MessageSquare className="w-6 h-6 text-info-foreground" />
              </motion.div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">
                  Recent Reviews
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Latest customer feedback
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {totalReviews}
                </div>
                <div className="text-xs text-muted-foreground">
                  Total Reviews
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-success/10 text-success border-0 px-3 py-1.5"
              >
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                <span className="font-semibold">+{reviewsChange}%</span>
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 border-border/50">
                  <TableHead className="font-semibold text-foreground">
                    Customer
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Review & Rating
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Order
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Date
                  </TableHead>
                  <TableHead className="w-28"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-muted/20 transition-colors border-border/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground text-sm font-semibold shadow-md">
                          {review.customer
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {review.customer}
                          </div>
                          <Badge variant="secondary" className="text-xs mt-0.5">
                            {review.orders} orders
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2 max-w-lg">
                        <div className="flex items-center gap-2">
                          <RatingStars rating={review.rating} />
                          <span className="text-sm font-medium text-muted-foreground">
                            ({review.rating}/5)
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {review.review}
                        </p>
                        {reviewReplies[index] && (
                          <div className="mt-3 p-3 bg-primary/5 border-l-2 border-primary rounded-r-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <MessageSquare className="w-3 h-3 text-primary" />
                              <span className="text-xs font-semibold text-primary">
                                Your Reply
                              </span>
                            </div>
                            <p className="text-sm text-foreground">
                              {reviewReplies[index]}
                            </p>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-lg font-mono">
                        {review.orderId}
                      </code>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {review.date}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={reviewReplies[index] ? "secondary" : "default"}
                        className="h-9 px-4 text-xs"
                        onClick={() =>
                          handleReplyClick(
                            index,
                            review.customer,
                            review.review,
                          )
                        }
                        disabled={!!reviewReplies[index]}
                      >
                        {reviewReplies[index] ? "Replied" : "Reply"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile/Tablet Card View */}
          <motion.div
            className="lg:hidden space-y-4 p-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-secondary/30 hover:bg-secondary/50 p-4 rounded-2xl border border-border/50 transition-all duration-200"
              >
                {/* Customer Info */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-semibold shadow-md">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {review.customer}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {review.orders} orders
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {review.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <code className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-lg font-mono">
                    {review.orderId}
                  </code>
                </div>

                {/* Rating and Review */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <RatingStars rating={review.rating} />
                    <span className="text-sm font-medium text-muted-foreground">
                      ({review.rating}/5)
                    </span>
                  </div>

                  <div className="relative p-3 bg-card rounded-xl border border-border/50">
                    <Quote className="absolute top-2 left-2 w-4 h-4 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground leading-relaxed pl-5">
                      {review.review}
                    </p>
                  </div>

                  {reviewReplies[index] && (
                    <div className="p-3 bg-primary/5 border-l-2 border-primary rounded-r-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="w-3 h-3 text-primary" />
                        <span className="text-xs font-semibold text-primary">
                          Your Reply
                        </span>
                      </div>
                      <p className="text-sm text-foreground">
                        {reviewReplies[index]}
                      </p>
                    </div>
                  )}
                </div>

                {/* Reply Button */}
                <div className="mt-4 flex justify-end">
                  <Button
                    size="sm"
                    variant={reviewReplies[index] ? "secondary" : "default"}
                    onClick={() =>
                      handleReplyClick(index, review.customer, review.review)
                    }
                    disabled={!!reviewReplies[index]}
                  >
                    {reviewReplies[index] ? "Replied" : "Reply"}
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Insights Panel */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="m-4 bg-gradient-to-br from-info/5 via-info/3 to-transparent p-4 rounded-2xl border border-info/20"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-info/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-info" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground mb-1">
                  Review Insights
                </div>
                <p className="text-sm text-muted-foreground">
                  Recent feedback shows consistent quality expectations.{" "}
                  <span className="font-medium text-foreground">
                    Response rate: 85% within 24 hours.
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      <ReviewReplyDialog
        isOpen={replyDialog.isOpen}
        onClose={closeReplyDialog}
        customerName={replyDialog.customerName}
        reviewText={replyDialog.reviewText}
        onReplySubmit={handleReplySubmit}
      />
    </>
  );
};
