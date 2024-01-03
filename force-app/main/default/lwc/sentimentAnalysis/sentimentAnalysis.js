import { LightningElement, track } from "lwc";
import getSentimentAnalysis from "@salesforce/apex/SentimentAnalysisController.getSentimentAnalysis";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class SentimentAnalysis extends LightningElement {
  @track questions = [
    {
      id: "question1",
      text: "On a scale of 1 to 10, how satisfied are you with our product?"
    },
    {
      id: "question2",
      text: "On a scale of 0 to 10, how likely are you to recommend our product/service to friends, family, or colleagues?"
    },
    {
      id: "question3",
      text: "How would you rate the quality and usefulness of our product? Please provide any specific feedback or suggestions for improvement"
    }
  ];
  @track answers = {};
  @track sentimentResults = [];
  isLoading = false; 

  promptTemplate = `Hello, I would like to perform a sentiment analysis on a set of survey questions and their corresponding responses. Below are the questions along with the answers provided by a customer. Please analyze the sentiments expressed in each answer, determining whether they are positive, negative, or neutral. Additionally, provide a brief explanation for the sentiment you've identified in each case.

    {{question1}}
    {{answer1}}
    
    {{question2}}
    {{answer2}}

    {{question3}}
    {{answer3}}

    For each answer, please provide:

    Sentiment Rating: Positive, Negative, or Neutral.
    Explanation: A brief rationale for the sentiment rating based on the content of the response.

    and provide an overal rating and explanation.

    Please return the response in this json format {"Question 1":{"Answer":"...","Sentiment Rating":"...","Explanation":"..."},"Question 2":{"Answer":"...","Sentiment Rating":"...","Explanation":"...."},"Question 3":{"Answer":"...","Sentiment Rating":"...","Explanation":"..."},"Overall":{"Sentiment Rating":"...","Explanation":"..."}}`;

  handleInputChange(event) {
    // Update answers based on input
    this.answers[event.target.name] = event.target.value;
  }

  handleAnalyze() {
    // Check if all questions have been answered
    const allAnswersProvided = this.questions.every((question) => {
      return (
        this.answers[question.id] && this.answers[question.id].trim() !== ""
      );
    });

    if (!allAnswersProvided) {
      // Not all answers are provided, show an error toast
      this.showToast(
        "Error",
        "Please answer all the questions before analyzing sentiment.",
        "error"
      );
      return; // Stop further execution
    }

    this.isLoading = true; // Start loading indicator
    // Construct the prompt from the questions and answers
    const prompt = this.constructPrompt();

    // Call the Apex method
    getSentimentAnalysis({ promptText: prompt })
      .then((result) => {
        console.log("------result", result);
        // Process and display results
        this.processResults(result);
        this.error = undefined;

        // Show success toast message
        this.showToast(
          "Success",
          "Sentiment analysis completed successfully.",
          "success"
        );
      })
      .catch((error) => {
        // Handle errors
        this.error = error;
        this.analysisResults = undefined;
        // Show error toast message
        this.showToast("Error", error.body.message, "error");
      })
      .finally(() => {
        this.isLoading = false; // Stop loading indicator
      });
  }

  processResults(apiResponse) {
    let results = JSON.parse(apiResponse);
    this.sentimentResults = Object.keys(results).map((key) => {
      let result = results[key];
      return {
        question: key, // "Question 1", "Question 2", "Question 3", or "Overall"
        answer: result.Answer,
        sentiment: result["Sentiment Rating"],
        explanation: result.Explanation,
        icon: this.getIconName(result["Sentiment Rating"]) // Function to determine the icon
      };
    });
  }

  constructPrompt() {
    // Initialize the prompt with the template
    let prompt = this.promptTemplate;

    // Loop through each question and replace the placeholders with the actual question and answer
    this.questions.forEach((question, index) => {
      // Adjust index to match the template numbering (1-based)
      const questionNumber = index + 1;

      // Replace the question placeholder
      prompt = prompt.replace(
        `{{question${questionNumber}}}`,
        `Question ${questionNumber}: "${question.text}"`
      );

      // Replace the answer placeholder with the user's response or a default text if not answered
      const answer = this.answers[question.id] || "No response provided.";
      prompt = prompt.replace(
        `{{answer${questionNumber}}}`,
        `Answer: "${answer}"`
      );
    });

    // Return the constructed prompt
    return prompt;
  }

  // Show toast messages
  showToast(title, message, variant) {
    const event = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant // success, error, warning or info
    });
    this.dispatchEvent(event);
  }

  // Get icon name for each sentiment Rating
  getIconName(sentimentRating) {
    switch (sentimentRating) {
      case "Positive":
        return "utility:like";
      case "Neutral":
        return "utility:help";
      case "Negative":
        return "utility:dislike";
      default:
        return ""; 
    }
  }
}
