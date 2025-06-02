
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import BugReportForm from '@/components/bugs/BugReportForm';

const BugReport: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-college-600 to-college-800 p-6 text-white">
              <h1 className="text-2xl font-bold">Report a Bug</h1>
              <p className="opacity-90 mt-1">
                Help us improve the platform by reporting issues you encounter
              </p>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">How it works:</h2>
                <div className="space-y-2 text-muted-foreground">
                  <p>1. Fill out the form with details about the bug you encountered</p>
                  <p>2. Our team will review the report and prioritize the fix</p>
                  <p>3. You'll receive updates when the status of your report changes</p>
                </div>
              </div>
              
              <BugReportForm />
            </div>
          </div>
          
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">What information should I include in my bug report?</h3>
                <p className="text-muted-foreground mt-1">
                  Please include what you were trying to do, what happened, what you expected to happen, and any error messages you saw.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">How do I check the status of my bug report?</h3>
                <p className="text-muted-foreground mt-1">
                  You can view all your submitted bug reports and their statuses from your dashboard.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">How are bugs prioritized?</h3>
                <p className="text-muted-foreground mt-1">
                  Bugs are prioritized based on their severity, how many users they affect, and their impact on core functionality.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Can I submit feature requests here too?</h3>
                <p className="text-muted-foreground mt-1">
                  This form is specifically for reporting bugs. For feature requests, please use the feedback form in the settings page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} CampusEvents. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BugReport;
