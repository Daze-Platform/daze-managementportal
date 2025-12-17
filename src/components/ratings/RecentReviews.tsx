
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, MessageSquare, User } from 'lucide-react';
import { ReviewReplyDialog } from '@/components/ratings/ReviewReplyDialog';
import { RatingStars } from './RatingStars';

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

export const RecentReviews = ({ reviews, totalReviews, reviewsChange }: RecentReviewsProps) => {
  const [replyDialog, setReplyDialog] = useState<{
    isOpen: boolean;
    reviewIndex: number | null;
    customerName: string;
    reviewText: string;
  }>({
    isOpen: false,
    reviewIndex: null,
    customerName: '',
    reviewText: ''
  });
  const [reviewReplies, setReviewReplies] = useState<Record<number, string>>({});

  const handleReplyClick = (index: number, customerName: string, reviewText: string) => {
    setReplyDialog({
      isOpen: true,
      reviewIndex: index,
      customerName,
      reviewText
    });
  };

  const handleReplySubmit = (reply: string) => {
    if (replyDialog.reviewIndex !== null) {
      setReviewReplies(prev => ({
        ...prev,
        [replyDialog.reviewIndex!]: reply
      }));
    }
  };

  const closeReplyDialog = () => {
    setReplyDialog({
      isOpen: false,
      reviewIndex: null,
      customerName: '',
      reviewText: ''
    });
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
                  Item Reviews
                </CardTitle>
                <p className="text-sm text-gray-600">Recent customer feedback and ratings</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalReviews}</div>
                <div className="text-xs text-gray-500">Store Reviews</div>
              </div>
              <div className="flex items-center gap-1 bg-green-100 px-3 py-1.5 rounded-full">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-600">+{reviewsChange}%</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-white/60 backdrop-blur-sm border-blue-100">
                  <TableHead className="font-semibold text-blue-800">Customer</TableHead>
                  <TableHead className="font-semibold text-blue-800">Review & Rating</TableHead>
                  <TableHead className="font-semibold text-blue-800">Order</TableHead>
                  <TableHead className="font-semibold text-blue-800">Date</TableHead>
                  <TableHead className="w-32"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review, index) => (
                  <TableRow key={index} className="hover:bg-white/50 transition-colors border-blue-100">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white text-sm font-medium shadow-sm">
                          {review.customer.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900">{review.customer}</div>
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                            {review.orders} orders
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2 max-w-md">
                        <div className="flex items-center gap-2">
                          <RatingStars rating={review.rating} />
                          <span className="text-sm font-medium text-gray-600">({review.rating}/5)</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{review.review}</p>
                        {reviewReplies[index] && (
                          <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-md">
                            <div className="flex items-center gap-2 mb-1">
                              <MessageSquare className="w-3 h-3 text-blue-600" />
                              <span className="text-xs font-medium text-blue-700">Restaurant Reply</span>
                            </div>
                            <p className="text-sm text-blue-800">{reviewReplies[index]}</p>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">
                        {review.orderId}
                      </code>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{review.date}</TableCell>
                    <TableCell>
                      <Button
                        className="h-9 px-4 text-xs bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleReplyClick(index, review.customer, review.review)}
                        disabled={!!reviewReplies[index]}
                      >
                        {reviewReplies[index] ? 'Replied' : 'Reply'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden space-y-4 p-4">
            {reviews.map((review, index) => (
              <div 
                key={index} 
                className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Customer Info */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white font-medium shadow-sm">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{review.customer}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                          {review.orders} orders
                        </Badge>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-600">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <code className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">
                    {review.orderId}
                  </code>
                </div>

                {/* Rating and Review */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <RatingStars rating={review.rating} />
                    <span className="text-sm font-medium text-gray-600">({review.rating}/5)</span>
                  </div>
                  
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-200">
                    "{review.review}"
                  </p>

                  {reviewReplies[index] && (
                    <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-md">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="w-3 h-3 text-blue-600" />
                        <span className="text-xs font-medium text-blue-700">Restaurant Reply</span>
                      </div>
                      <p className="text-sm text-blue-800">{reviewReplies[index]}</p>
                    </div>
                  )}
                </div>

                {/* Reply Button */}
                <div className="mt-4 flex justify-end">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleReplyClick(index, review.customer, review.review)}
                    disabled={!!reviewReplies[index]}
                  >
                    {reviewReplies[index] ? 'Replied' : 'Reply'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Insights Panel */}
          <div className="m-4 bg-gradient-to-r from-blue-50 to-gray-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm">💡</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-blue-800 mb-1">Review Insights</div>
                <div className="text-sm text-blue-700">
                  Recent feedback shows consistent quality expectations. 
                  <span className="font-medium"> Response rate: 85% within 24 hours.</span> 
                  Consider addressing common themes to improve satisfaction.
                </div>
              </div>
            </div>
          </div>
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
