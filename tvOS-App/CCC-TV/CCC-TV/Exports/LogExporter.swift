//
//  LogExporter.swift
//  CCCtv
//
//  Created by Kris Simon on 14/12/15.
//  Copyright © 2015 aus der Technik. All rights reserved.
//

import UIKit
import TVMLKit

@objc protocol LogExportProtocol : JSExport {
    func Info(string: String) -> Void
    
}

class LogExport: NSObject, LogExportProtocol {
    
    func Info(string: String) {
        NSLog(string)
    }
    
}
