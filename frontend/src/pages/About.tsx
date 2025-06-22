import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">About CampusConnect</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
            <CardDescription>
              Connecting students with campus activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              CampusEvents is a comprehensive platform designed to streamline
              event management at educational institutions. Our mission is to
              enhance campus life by making it easier for students to discover,
              register for, and attend events, while providing administrators
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
              If you have questions, suggestions, or need assistance with the
              CampusEvents platform, please don't hesitate to reach out to our
              support team.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Member 1 */}
              <div className="bg-muted p-4 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg">Binit Joshi</h3>
                <p className="text-sm text-muted-foreground">
                  Role: Frontend Developer
                </p>
                <p className="text-sm">Email: joshibinit8488@gmail.com</p>
              </div>

              {/* Member 2 */}
              <div className="bg-muted p-4 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg">Sujal Maharjan</h3>
                <p className="text-sm text-muted-foreground">
                  Role: Backend Developer
                </p>
                <p className="text-sm">Email: sujalmaharjan007@gmail.com</p>
              </div>

              {/* Member 3 */}
              <div className="bg-muted p-4 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg">Kripa Khanal</h3>
                <p className="text-sm text-muted-foreground">
                  Role: Scrum Master
                </p>
                <p className="text-sm">Email: kripakhanal54@gmail.com</p>
              </div>

              {/* Member 4 */}
              <div className="bg-muted p-4 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg">Astha Shrestha</h3>
                <p className="text-sm text-muted-foreground">Role: AI</p>
                <p className="text-sm">Email: aasthashrestha688@gmail.com</p>
              </div>

              {/* Member 5 */}
              <div className="bg-muted p-4 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg">Kabin Shrestha</h3>
                <p className="text-sm text-muted-foreground">Role: QA</p>
                <p className="text-sm">Email: kabinshrestha377@gmail.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
