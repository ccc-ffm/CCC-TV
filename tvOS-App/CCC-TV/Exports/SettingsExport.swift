//
//  SettingsExport.swift
//  CCC-TV
//
//  Created by Kris Simon on 20/10/15.
//  Copyright © 2015 aus der Technik. All rights reserved.
//

import UIKit
import TVMLKit

@objc protocol SettingsExportProtocol : JSExport {
    func getItem(key:String) -> String?
    
    func setItem(key:String, data:String)
}

class SettingsExport: NSObject, SettingsExportProtocol {

    func getItem(key: String) -> String? {
        
        return "String value"
    }
    
    func setItem(key: String, data: String) {
            print("Set key:\(key) value:\(data)")
    }
}
