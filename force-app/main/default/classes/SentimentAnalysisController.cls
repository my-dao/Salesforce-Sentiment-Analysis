public class SentimentAnalysisController {
  // Endpoint URL for OpenAI API
  private static final String ENDPOINT_URL = 'https://api.openai.com/v1/chat/completions';
  private static final String API_KEY = '<Your API Key>';
  private static final String TEXT_GENERATION_MODEL = 'gpt-3.5-turbo-1106';

  // Method to call OpenAI API and get sentiment analysis
  @AuraEnabled
  public static String getSentimentAnalysis(String promptText) {
    // Prepare the request
    ChatCompletionRequest request = new ChatCompletionRequest();
    request.model = TEXT_GENERATION_MODEL;
    request.messages = new List<Message>{ new Message('user', promptText) };
    request.temperature = 0.7;
    request.max_tokens = 500;
    request.top_p = 1;
    request.frequency_penalty = 0;
    request.presence_penalty = 0;
    request.response_format = new Map<String, String>{
      'type' => 'json_object'
    };

    // Make the HTTP callout to OpenAI
    Http http = new Http();
    HttpRequest httpRequest = new HttpRequest();
    httpRequest.setEndpoint(ENDPOINT_URL);
    httpRequest.setMethod('POST');
    httpRequest.setHeader('Content-Type', 'application/json');
    httpRequest.setHeader('Authorization', 'Bearer ' + API_KEY);
    httpRequest.setBody(JSON.serialize(request));
    httpRequest.setTimeout(60000);

    System.debug(JSON.serialize(request));

    HttpResponse httpResponse = http.send(httpRequest);

    // Parse the response
    if (httpResponse.getStatusCode() == 200) {
      ChatCompletionResponse response = (ChatCompletionResponse) JSON.deserialize(
        httpResponse.getBody(),
        ChatCompletionResponse.class
      );
      return response.choices[0].message.content; // Return the content of the first choice message
    } else {
      // Handle errors or unsuccessful responses
      System.debug('Error from OpenAI: ' + httpResponse.getBody());
      return 'Error retrieving sentiment analysis.';
    }
  }

  // Inner class to represent the request structure
  public class ChatCompletionRequest {
    @AuraEnabled
    public String model;
    @AuraEnabled
    public List<Message> messages;
    @AuraEnabled
    public Double temperature;
    @AuraEnabled
    public Integer max_tokens;
    @AuraEnabled
    public Integer top_p;
    @AuraEnabled
    public Double frequency_penalty;
    @AuraEnabled
    public Double presence_penalty;
    @AuraEnabled
    public Map<String, String> response_format;
  }

  public class Message {
    @AuraEnabled
    public String role;
    @AuraEnabled
    public String content;

    public Message(String role, String content) {
      this.role = role;
      this.content = content;
    }
  }

  // Inner class to represent the response structure
  public class ChatCompletionResponse {
    @AuraEnabled
    public List<Choice> choices;
  }

  public class Choice {
    @AuraEnabled
    public Message message;
  }
}
