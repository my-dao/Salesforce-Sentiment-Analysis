# Sentiment Analysis LWC Using OpenAI API
This repository contains a Salesforce Lightning Web Component designed for sentiment analysis. The component allows users to input responses to survey questions, which are then analyzed using the OpenAI API to determine the sentiment expressed in each answer.

![Sentiment Analysis](/images/Sentiment%20Analysis.png)

## Features

- Sentiment Analysis: Leverages OpenAI's API to analyze the sentiment of the responses.
- Visual Feedback: Displays the sentiment analysis results in an easy-to-understand format.

## Prerequisites

- Access to a Salesforce org with Lightning Web Components enabled.
- API access and an API key from OpenAI. To be able to do this, we need an OpenAI account. Please note that every API call to OpenAI will be charged. For information about the pricing, please visit: [OpenAI Pricing site](https://openai.com/pricing).

## Components

 - sentimentAnalysis LWC component.
 - SentimentAnalysisController.

## Setup and Deployment
- Clone the Repository: Clone this repository to your local machine or download the files.
- Deploy to Salesforce: Deploy the component to your Salesforce org using SFDX or your preferred deployment tool.
- Add to a Page: Add the sentimentAnalysis component to a Lightning Page or Community Page as needed.
## Configuration
- Set API Key: Ensure your OpenAI API key is correctly set in the API_KEY constant within the SentimentAnalysisController.
- Add Remote Site setting for https://api.openai.com.
- Endpoint and Model: The endpoint URL and text generation model are set to OpenAI's chat completion endpoint and 'gpt-3.5-turbo-1106' model, respectively because the expected response in this scenario is the JSON formated one. Adjust as needed based on the specific API and model you're using.
## Process
- Construct Prompt: The constructPrompt function in the sentimentAnalysis.js file constructs the prompt to be sent to the OpenAI API, replacing placeholders with actual questions and answers.
- API Call: The handleAnalyze function makes a call to the getSentimentAnalysis method in the Apex controller, which sends a request to the OpenAI API and retrieves the sentiment analysis results.
- Display Results: The results are processed and displayed in the component's UI.
## Limitations

This project is a simple demonstration, and there are a few areas you might want to improve:
- Instead of keeping the API key right in the code, it's better to use Named Credentials. This makes your project more secure and easier to manage.
- The questions are currently hard coded. It's a better to store them in a custom object/metadata. This way, you can change the questions without altering the code itself.


