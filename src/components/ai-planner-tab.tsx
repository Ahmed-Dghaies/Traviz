import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Sparkles, RefreshCw, AlertCircle, ExternalLink } from "lucide-react";
import { useGetTripsQuery } from "@/lib/supabase/tripsApi";
import { useAuth } from "./auth/auth-provider";
import { skipToken } from "@reduxjs/toolkit/query";

type PlannerState = "questions" | "generating" | "results" | "setup";

interface PlannerAnswers {
  activityLevel: string;
  tripPurpose: string;
  interests: string[];
  budget: string;
  groupType: string;
  additionalInfo: string;
}

export function AIPlannerTab({ tripId }: { tripId: string }) {
  const { user } = useAuth();
  const { data: trips } = useGetTripsQuery(user?.id ?? skipToken);
  const trip = (trips ?? []).find((t) => t.id === tripId);

  const [state, setState] = useState<PlannerState>("questions");
  const [answers, setAnswers] = useState<PlannerAnswers>({
    activityLevel: "",
    tripPurpose: "",
    interests: [],
    budget: "",
    groupType: "",
    additionalInfo: "",
  });
  const [suggestions, setSuggestions] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleInterestChange = (interest: string, checked: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      interests: checked
        ? [...prev.interests, interest]
        : prev.interests.filter((i) => i !== interest),
    }));
  };

  const generatePrompt = () => {
    if (!trip) return "";

    const duration =
      Math.ceil(
        (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    return `Create a detailed ${duration}-day travel itinerary for ${trip.destination} for ${
      trip.people
    } ${trip.people === 1 ? "person" : "people"}.

Trip Details:
- Destination: ${trip.destination}
- Duration: ${duration} days
- Group size: ${trip.people} people
- Activity level: ${answers.activityLevel}
- Trip purpose: ${answers.tripPurpose}
- Interests: ${answers.interests.join(", ")}
- Budget: ${answers.budget}
- Group type: ${answers.groupType}
${answers.additionalInfo ? `- Additional preferences: ${answers.additionalInfo}` : ""}

Please provide a day-by-day breakdown with:
- 3-5 activities per day
- Suggested times for each activity
- Brief descriptions
- Mix of must-see attractions and local experiences
- Consider travel time between locations
- Include meal suggestions

Format as a clear day-by-day schedule.`;
  };

  const generateSuggestions = async () => {
    setState("generating");
    setError("");

    try {
      const prompt = generatePrompt();

      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 500) {
          setState("setup");
          setError(data.error);
          return;
        }
        throw new Error(data.error || "Failed to generate suggestions");
      }

      setSuggestions(data.suggestions);
      setState("results");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message || "Failed to generate suggestions. Please try again.");
      setState("questions");
    }
  };

  const canGenerate =
    answers.activityLevel && answers.tripPurpose && answers.budget && answers.groupType;

  if (state === "setup") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            Setup Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h3 className="font-medium">To use AI Travel Planner:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>
                Get a free API key from{" "}
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-500 inline-flex items-center gap-1"
                >
                  Google AI Studio
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                Add it to your environment variables as{" "}
                <code className="bg-muted px-1 rounded">GEMINI_API_KEY</code>
              </li>
              <li>Restart your development server</li>
            </ol>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setState("questions")}>
              Back to Questions
            </Button>
            <Button
              onClick={generateSuggestions}
              disabled={!canGenerate}
              className="bg-teal-600 hover:bg-teal-500 text-white"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (state === "generating") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500 mb-4" />
          <p className="text-center text-muted-foreground">
            Generating your personalized travel plan...
          </p>
          <p className="text-xs text-muted-foreground mt-2">This may take 10-30 seconds</p>
        </CardContent>
      </Card>
    );
  }

  if (state === "results") {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-teal-500" />
            AI Travel Suggestions
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => setState("questions")}>
            <RefreshCw className="h-4 w-4 mr-1" />
            New Plan
          </Button>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{suggestions}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-teal-500" />
          AI Travel Planner
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Answer a few questions to get personalized travel suggestions for {trip?.destination}
        </p>
      </CardHeader>
      <CardContent className="grid gap-6">
        {error && state === "questions" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-3">
          <Label className="text-sm font-medium">How active do you want to be?</Label>
          <RadioGroup
            value={answers.activityLevel}
            onValueChange={(value) => setAnswers((prev) => ({ ...prev, activityLevel: value }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="activity-low" />
              <Label htmlFor="activity-low" className="text-sm">
                Relaxed - Prefer leisurely activities
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate" id="activity-moderate" />
              <Label htmlFor="activity-moderate" className="text-sm">
                Moderate - Mix of active and relaxed
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="activity-high" />
              <Label htmlFor="activity-high" className="text-sm">
                Very Active - Lots of walking and activities
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid gap-3">
          <Label className="text-sm font-medium">What&apos;s the main purpose of your trip?</Label>
          <RadioGroup
            value={answers.tripPurpose}
            onValueChange={(value) => setAnswers((prev) => ({ ...prev, tripPurpose: value }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="leisure" id="purpose-leisure" />
              <Label htmlFor="purpose-leisure" className="text-sm">
                Leisure & Fun
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cultural" id="purpose-cultural" />
              <Label htmlFor="purpose-cultural" className="text-sm">
                Cultural Exploration
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="business" id="purpose-business" />
              <Label htmlFor="purpose-business" className="text-sm">
                Business (with some leisure)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="adventure" id="purpose-adventure" />
              <Label htmlFor="purpose-adventure" className="text-sm">
                Adventure & Outdoor
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid gap-3">
          <Label className="text-sm font-medium">
            What interests you most? (Select all that apply)
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {[
              "Museums & Art",
              "Food & Dining",
              "Shopping",
              "Nightlife",
              "Nature & Parks",
              "Architecture",
              "Local Markets",
              "Photography",
              "History",
              "Music & Shows",
            ].map((interest) => (
              <div key={interest} className="flex items-center space-x-2">
                <Checkbox
                  id={`interest-${interest}`}
                  checked={answers.interests.includes(interest)}
                  onCheckedChange={(checked) => handleInterestChange(interest, !!checked)}
                />
                <Label htmlFor={`interest-${interest}`} className="text-sm">
                  {interest}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <Label className="text-sm font-medium">What&apos;s your budget level?</Label>
          <RadioGroup
            value={answers.budget}
            onValueChange={(value) => setAnswers((prev) => ({ ...prev, budget: value }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="budget" id="budget-low" />
              <Label htmlFor="budget-low" className="text-sm">
                Budget-friendly
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate" id="budget-moderate" />
              <Label htmlFor="budget-moderate" className="text-sm">
                Moderate spending
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="luxury" id="budget-luxury" />
              <Label htmlFor="luxury" className="text-sm">
                Luxury experiences
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid gap-3">
          <Label className="text-sm font-medium">Who are you traveling with?</Label>
          <RadioGroup
            value={answers.groupType}
            onValueChange={(value) => setAnswers((prev) => ({ ...prev, groupType: value }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="solo" id="group-solo" />
              <Label htmlFor="group-solo" className="text-sm">
                Solo traveler
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="couple" id="group-couple" />
              <Label htmlFor="group-couple" className="text-sm">
                Couple
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="family" id="group-family" />
              <Label htmlFor="group-family" className="text-sm">
                Family with children
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="friends" id="group-friends" />
              <Label htmlFor="group-friends" className="text-sm">
                Friends group
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="additional-info" className="text-sm font-medium">
            Any specific preferences or requirements? (Optional)
          </Label>
          <Textarea
            id="additional-info"
            placeholder="e.g., dietary restrictions, accessibility needs, specific places you want to visit..."
            value={answers.additionalInfo}
            onChange={(e) => setAnswers((prev) => ({ ...prev, additionalInfo: e.target.value }))}
            rows={3}
          />
        </div>

        <Button
          onClick={generateSuggestions}
          disabled={!canGenerate}
          className="bg-teal-600 hover:bg-teal-500 text-white"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Generate Travel Plan
        </Button>
      </CardContent>
    </Card>
  );
}
