import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GiftResponse {
  name?: string;
  givesto?: string;
  error?: {
    code: string;
    message: string;
  };
}

export default function LotteryChecker() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GiftResponse | null>(null);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow positive integers, max 8 characters
    if (/^\d{0,8}$/.test(value)) {
      setCode(value);
      // Clear previous result when user starts typing
      if (result) {
        setResult(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/gift/${code}`);
      const data: GiftResponse = await response.json();

      setResult(data);
    } catch {
      setResult({
        error: {
          code: "NETWORK_ERROR",
          message: "Failed to connect to the server. Please try again.",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = !code.trim() || isLoading;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Lottery Checker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter lottery code"
                value={code}
                onChange={handleCodeChange}
                className="text-center"
                maxLength={8}
                autoComplete="off"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isButtonDisabled}>
              {isLoading ? "Checking..." : "Submit Code"}
            </Button>
          </form>

          {result && (
            <div className="mt-4">
              {result.error ? (
                <Alert variant="destructive">
                  <AlertDescription>{result.error.message}</AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <AlertDescription>
                    <div className="space-y-2">
                      <p>
                        <strong>Your name is:</strong> {result.name}
                      </p>
                      <p>
                        <strong>Recipient&apos;s name:</strong> {result.givesto}
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
