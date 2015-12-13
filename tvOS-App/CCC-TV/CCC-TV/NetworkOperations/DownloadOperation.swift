//
//  DownloadConferencesOperation.swift
//  CCCtv
//
//  Created by Kris Simon on 10/12/15.
//  Copyright © 2015 aus der Technik. All rights reserved.
//

import Foundation
import SwiftyJSON

class DownloadOperation: NSOperation {

    private var _finished: Bool = false {
        willSet {
            self.willChangeValueForKey("isFinished");
        }
        didSet {
            self.didChangeValueForKey("isFinished");
        }
    }
    override var finished: Bool {
        get {
            return _finished
        }
    }
    
    override init(){
        
    }
    
    override func main() {
        var conferencesRequest = ConferencesRequest()
        conferencesRequest.performRequest(){
            (err: RequestError?, data: JSON?)->() in
            
            print("####")
            dump(data)
            
            self._finished = true
        }
    
    }
    
    
    
}
