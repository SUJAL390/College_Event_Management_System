
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const About: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">About CampusEvents</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
          <CardDescription>Connecting students with campus activities</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            CampusEvents is a comprehensive platform designed to streamline event management
            at educational institutions. Our mission is to enhance campus life by making it easier
            for students to discover, register for, and attend events, while providing administrators
            with powerful tools to manage these activities.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
          <CardDescription>What makes CampusEvents special</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Easy event discovery and registration</li>
            <li>QR code check-in system for events</li>
            <li>Administrative tools for event management</li>
            <li>Attendance tracking and reporting</li>
            <li>Bug reporting system for continuous improvement</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>Get in touch with our team</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            If you have questions, suggestions, or need assistance with the CampusEvents platform,
            please don't hesitate to reach out to our support team.
          </p>
          <div className="flex flex-col space-y-2">
            <p><strong>Email:</strong> support@campusevents.edu</p>
            <p><strong>Phone:</strong> (555) 123-4567</p>
            <p><strong>Office:</strong> Student Center, Room 301</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
