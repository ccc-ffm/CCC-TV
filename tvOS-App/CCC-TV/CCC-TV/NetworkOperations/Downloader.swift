//
//  Downloader.swift
//  CCCtv
//
//  Created by Kris Simon on 10/12/15.
//  Copyright © 2015 aus der Technik. All rights reserved.
//

import Foundation

var downloadQueue = NSOperationQueue()

class Downloader {
    
    func performDownload(completionHandler callback: (()->())? = nil){
        // conferences
        let conferencesDownloader = DownloadOperation()
        
        conferencesDownloader.completionBlock = {
            print("# conferencesDownloader finish")
            if let callback = callback {
                callback()
            }
        }
        
        downloadQueue.addOperation(conferencesDownloader)
    }
    
}