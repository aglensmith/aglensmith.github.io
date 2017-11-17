---
title: " beaumont.js&#58; Calling All SETX Coders"
layout: post
date: 2015-12-17 21:07
headerImage: false
tag:
- networking
- community
- beaumont.js
- meetups
star: true
category: blog
author: Austin Smith
description: coffee and code
---

>###Do not use a cannon to kill a mosquito 
>
>###-- Confucious

Although wantonly attempting to obliterate a mosquito with a black powder cannon might be fun, it is *probably* a bad idea; it is overkill and uncessary. Confucious' advice on insect removal applies to software development as well. I frequently consider the ancient Chinese teacher's words before installing third party libraries into a project.

That's why, for my current project [PolAgora](/polagora.html), I chose .NET's HttpClient to make HTTP requests and JavaScriptSerializer to deserialize response JSON, rather than third party packages like [Flurl](htstp://tmenier.github.io/Flurl/) and [Json.net](http://www.newtonsoft.com/json) -- these tools are highly regarded in the community, but I only need to squash a bug, not seige a fortress. I would like to share what I learned to anyone out there who may be interested.

Twitter's APIs use several different methods of Authentication. This post covers [application-only authentication](https://dev.twitter.com/oauth/application-only) for Twitter's Search API, which uses [OAuth 2](http://tools.ietf.org/html/rfc6749). I suggest reading [twitter's overview](https://dev.twitter.com/oauth/application-only) of the [application-only authentication](https://dev.twitter.com/oauth/application-only) process before continuing.

##1. Setup App.config

If you are just writing a one-off, private script, you can probably skip this step, but if you intend to use version control and github or share your code with anyone, it is strongly suggested that your API key and secret be stored outside of your code for security reasons. Adding a .config file to your project along with a .gitignore entry is a simple way of accomplishing this. If your project already has an App.Config, just add in an entrey for the Twitter Consumer Key and Consumer Secret like so:

```html
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
  ...
  <appSettings>
    <add key="TwitterKey" value="<<KEY>>" />
    <add key="TwitterSecret" value="<<SECRET>>"/>
  </appSettings>
  ...
</configuration>
```
Feel free to rename `TwitterKey` and `TwitterSecret` to whatever you like, but be sure to remember their names because we will use a special method to retreive them later. In place of `<<KEY>>` and `<<SECRET>>`, be sure to paste in your app's key and secret. 

<!-- Verify configuration file adding process -->
If you don't already have an App.config file, you can add one by clicking project > add > configuration file. If you want to make doubly sure not to accidently git push your API key, you can even load an external AppSettings file that is outside your project's root directory. Microsoft [has a good article](http://www.asp.net/identity/overview/features-api/best-practices-for-deploying-passwords-and-other-sensitive-data-to-aspnet-and-azure) on setting that up.

Let's import the necessary dependencies, then its time to write some code:

```csharp
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using System.Configuration;
```

##2. Create Response Class
Once we make our request for a bearer token, twitter's response content will be in JSON:

```json
{"token_type":"bearer","access_token":"AAAAAAAAAAAAAAAAAAAAA..."}
```

To be able to extract the access token from the JSON, we'll need to deserialize the response into a C# object. He's he class I created for the object:

<!-- verify needed DLLs -->

```csharp
namespace TwitterApiCaller
{
    public class Program
    {
        public class TwitterResponse
        {
            public string token_type { get; set; }
            public string access_token { get; set; }
            public string followers_count { get; set; }
        }
```

##3. Write method for Base 64 Encoding Credentials

Twitter requires API credentials be base 64 encoded before being sent over HTTP, so we'll need to add some code to handle the encoding. We'll use this method later: 

```csharp
        public static string Base64Encode(string stringText)
        {
            var stringTextBytes = System.Text.Encoding.UTF8.GetBytes(stringText);
            return System.Convert.ToBase64String(stringTextBytes);
        }
```

##4. Get Bearer Token with Asynch Method

I'm still digesting how asynch affects a progam's control flow, but the gist is that asynching a method opens a new, temporary thread specifically for the method, which allows the rest of the program code to execute without waiting for the asynch method to return. This will ensure other code -- for instance UI code -- is not blocked while the method is doing it's work.

```csharp
static async Task<string> GetBearerAsync()
{
    using (var client = new HttpClient())
    {
    ...
```

Notice we also instantiate an HttpClient object with `using`. The [using statement](https://msdn.microsoft.com/en-us/library/yh598w02.aspx) ensures that an object is properly disposed of after use, so that it doesn't use up resources when it is no longer needed. Edward Norton's character in Fight Club would say `using` makes "single-serving" objects. 


###String Declarations:
Twitter's API auth documentation suggests URL encoding tokens and secrets. We do that with HttpUtility, then Base 64 encode the concatenated key and secret, as required. 

```csharp       
        string key = ConfigurationManager.AppSettings["TwitterKey"];
        string secret = ConfigurationManager.AppSettings["TwitterSecret"];
        
        string keyEncoded = HttpUtility.UrlEncode(key);
        string secretEncoded = HttpUtility.UrlEncode(secret);
        
        string keySecretEncoded = Base64Encode(keyEncoded + ":" + secretEncoded);
        string credentials = ("Basic " + keySecretEncoded);
        
        string uri = "https://api.twitter.com/oauth2/token";
        string contentType = "application/x-www-form-urlencoded;charset=UTF-8";
        ...
```

###Setting up the headers and post body:


```csharp    
        //Add headers, skip validation that throws false errors
        client.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", credentials);
        client.DefaultRequestHeaders.TryAddWithoutValidation("Content-Type", contentType);

        //post body
        var values = new Dictionary<string, string> { { "grant_type", "client_credentials" } };
        var body = new FormUrlEncodedContent(values);
        ...
```

###POST, deserialization, and return of bearer access token:
Here, we post then deserialize the response content into the response object we created above. 

```csharp
        var response = await client.PostAsync(uri, body);
        var payload = await response.Content.ReadAsStringAsync();
        
        //Deserialize JSON into TwitterResponse object
        JavaScriptSerializer ser = new JavaScriptSerializer();
        TwitterResponse TwitterResponse = ser.Deserialize<TwitterResponse>(payload);
        
        string bearer = TwitterResponse.access_token;

        return bearer;
    }
}
```

##5. Authenticate Calls with Bearer Token
Now that the hard part of getting the bearer token is over, requests are much easier. Just make a request similar to above, using the bearer token in the authorization header:

```csharp
    public static void Main(string[] args)
    {
        string bearer = GetBearerAsync().Result;
        
        using (var client = new HttpClient())
        {
            string auth = "Bearer " + bearer;

            client.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", auth);
            client.DefaultRequestHeaders.TryAddWithoutValidation("User-Agent", "YourApplication");

            string uri = "https://api.twitter.com/1.1/users/show.json?screen_name=";
            var response = await client.GetAsync(uri + screen_name);
            var responseContent = await response.Content.ReadAsStringAsync();

            JavaScriptSerializer ser = new JavaScriptSerializer();
            TwitterResponse TwitterResponse = ser.Deserialize<TwitterResponse>(responseContent);

            Console.Writeline(TwitterResponse.followers_count;
        }
    }
```