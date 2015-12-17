//
//  Item.swift
//  CCCtv
//
//  Created by Kris Simon on 10/12/15.
//  Copyright © 2015 aus der Technik. All rights reserved.
//

import Foundation


var allEvents: [Event] = []

struct Event {
    
    var eventId: Int
    
    var title: String
    
    var subtitle: String
    
    var description: String
    
    var length: Int
    
    var tags: [String]
    
    var persons:[String]
    
    var slug: String
    
    var guid: String
    
    var url: NSURL
    
    var link: NSURL?
    
    var frontend_link: NSURL?
    
    var date: NSDate = NSDate()
    
    var release_date: NSDate?

    var updated_at: NSDate?

    var poster_url: NSURL?
    
    var thumb_url: NSURL?
    
    var conference_url: NSURL?
    
}