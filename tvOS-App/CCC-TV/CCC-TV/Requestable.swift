//
//  Requestable.swift
//  CCCtv
//
//  Created by Kris Simon on 13/12/15.
//  Copyright © 2015 aus der Technik. All rights reserved.
//

import Foundation
import SwiftyJSON

let apiUrl = "https://api.media.ccc.de/public"

enum RequestError {
    case JsonError
    case RequestError
    case MissingContextError
}

protocol Requestable {
    var jsonData: JSON { get set }
    var requestUrl: String { get }
    
    //init()
}


extension Requestable {
    
    mutating func performRequest(completionHandler: (RequestError?, JSON?)->()) {
        let url = NSURL(string: "\(apiUrl)\(requestUrl)")
        
        let configuration = NSURLSessionConfiguration.defaultSessionConfiguration()
        
        let request = NSURLRequest(URL: url!)
        
        let session = NSURLSession(
            configuration: configuration
            , delegate: SessionDelegate()
            , delegateQueue: NSOperationQueue.mainQueue()
        )
        
        let task = session.dataTaskWithRequest(request){
            (data: NSData?, response: NSURLResponse?, error: NSError?) -> Void in
            
            if error != nil {
                NSLog(error!.localizedDescription)
                completionHandler( RequestError.RequestError, nil)
            } else {
                let json = JSON(data: data!)
                if json.error != nil {
                    NSLog(json.error!.localizedDescription)
                    completionHandler(RequestError.JsonError, nil)
                } else {
                    self.jsonData = json
                    completionHandler(nil, json)
                }
            }
        }
        task.resume()
    }
    
}

class SessionDelegate: NSObject, NSURLSessionDelegate, NSURLSessionTaskDelegate {
    
    func URLSession(session: NSURLSession, task: NSURLSessionTask, didReceiveChallenge challenge: NSURLAuthenticationChallenge, completionHandler: (NSURLSessionAuthChallengeDisposition, NSURLCredential?) -> Void) {
        if let trust = challenge.protectionSpace.serverTrust {
            completionHandler(
                NSURLSessionAuthChallengeDisposition.UseCredential
                , NSURLCredential(forTrust: trust)
            )
        } else {
            completionHandler(NSURLSessionAuthChallengeDisposition.UseCredential, nil)
        }
    }
    
    func URLSession(session: NSURLSession, task: NSURLSessionTask, willPerformHTTPRedirection response: NSHTTPURLResponse, newRequest request: NSURLRequest, completionHandler: (NSURLRequest?) -> Void) {
        let newRequest : NSURLRequest? = request
        completionHandler(newRequest)
    }
}

