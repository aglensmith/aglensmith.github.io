---
layout: post
category : lessons
tagline: "Supporting tagline"
tags : [api, twitter, c#, tutorial, httpclient, OAuth Authentication]
title: How to Query Twitter's Search API with .Net's Httpclient
---
{% include JB/setup %}


>Do no use a cannon to kill a mosquito


###Steps:

* Setting up HttpClient
* OAuth Authentication
* Making the Calls

<br>

###Authentication

* Encode Consumer Key and Consumer Secret
* Get Bearer Token 
* Authenticate requests with bearer token


[Application only authentication](https://dev.twitter.com/oauth/application-only)


```csharp
static async Task<string> GetBearerAsync()
{
    using (var client = new HttpClient())
    {
        //keys
        string key = "123";
        string secret = "123";
        //URL encoding
        string keyEncoded = HttpUtility.UrlEncode(key);
        string secretEncoded = HttpUtility.UrlEncode(secret);
        //Base64 Encoded Token Credentials
        string tokenCredentials = Base64Encode(keyEncoded + ":" + secretEncoded);
        //Set headers, skip stupid validation
        client.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", "Basic " + tokenCredentials);
        client.DefaultRequestHeaders.TryAddWithoutValidation("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
        //Post Body
        var values = new Dictionary<string, string> { { "grant_type", "client_credentials" } };
        var content = new FormUrlEncodedContent(values);
        //POST
        var response = await client.PostAsync("https://api.twitter.com/oauth2/token", content);
        var responseContent = await response.Content.ReadAsStringAsync();
        return responseContent;
        }       
    }
```
        
