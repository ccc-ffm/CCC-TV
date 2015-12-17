//
//  Conference.swift
//  CCCtv
//
//  Created by Kris Simon on 10/12/15.
//  Copyright © 2015 aus der Technik. All rights reserved.
//

import Foundation

//  https://api.media.ccc.de/public/conferences

var allConferences: [Conference] = []

struct Conference {
    
    var title: String = ""

    var acronym: String = ""
    
    var logo_url: NSURL = NSURL()
    
    var updated_at: NSDate = NSDate()
    
    var aspect_ratio: String = ""
    
    var schedule_url: NSURL = NSURL()
    
    var images_url: NSURL = NSURL()
    
    var recordings_url: NSURL?
    
    var webgen_location: String = ""
    
    var slug: String = ""
    
    var url: NSURL = NSURL()

}