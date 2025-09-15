import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfileLoading() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-3">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="order-1 lg:col-span-3">
          <Card className="w-full max-w-sm mx-auto lg:max-w-none">
            <CardContent className="p-4 lg:p-6">
              <div className="text-center space-y-4">
                <Skeleton className="w-24 h-24 lg:w-32 lg:h-32 rounded-full mx-auto" />

                <Skeleton className="h-6 w-32 mx-auto" />

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-8" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-12 w-full" />
                  </div>

                  <div className="pt-3 border-t">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <Skeleton className="h-6 w-8 mx-auto" />
                        <Skeleton className="h-3 w-12 mx-auto mt-1" />
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <Skeleton className="h-6 w-8 mx-auto" />
                        <Skeleton className="h-3 w-10 mx-auto mt-1" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="order-2 lg:col-span-6">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-8 w-24" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-24" />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-28" />
                      <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-3 w-32 mt-1" />
                      </div>
                      <Skeleton className="h-6 w-12" />
                    </div>

                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-20" />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center space-y-3"
                      >
                        <Skeleton className="w-12 h-12 rounded-full mx-auto" />
                        <div>
                          <Skeleton className="h-8 w-8 mx-auto" />
                          <Skeleton className="h-3 w-12 mx-auto mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="order-3 hidden lg:block lg:col-span-3">
          <Card className="p-4 lg:p-6">
            <div className="space-y-4">
              <Skeleton className="h-5 w-24" />

              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
