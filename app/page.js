import FooterBar from "@/components/FooterBar";
import Login from "@/components/Login";
import TopHeader from "@/components/TopHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tag } from "lucide-react";
import Image from "next/image";

// Dummy data
const documents = [
  { id: 1, title: "Research Paper 1", author: "John Doe", date: "2024-08-28" },
  { id: 2, title: "Study on Climate Change", author: "Jane Smith", date: "2024-08-25" },
  { id: 3, title: "Machine Learning Basics", author: "Alice Johnson", date: "2024-08-22" },
];

const recentAdded = [
  { id: 1, title: "New Perspectives in AI", date: "2024-08-27" },
  { id: 2, title: "Quantum Computing Intro", date: "2024-08-26" },
];

const recommendations = [
  { id: 1, title: "Deep Learning for Beginners" },
  { id: 2, title: "Advanced Data Structures" },
];

// Custom DocumentCard component (without using Card component)
function DocumentCard({ title, author, date }) {
  return (
    <div className="border bg-white border-gray-300 p-4 flex flex-col">
      <div className="flex flex-row items-center gap-x-2 py-2 border-b">
      <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
      <p className="text-sm text-blue-500">{author}</p>
      </div>
    <div className="flex flex-row-reverse gap-x-2 items-center">
    <Image src="/assets/images/pdf.png" width={60} height={60} alt="PDF icon" className="ml-4" style={{objectFit:'contain'}}/>
<div className="">
<h2 className="text-lg text-black font-medium">{title}</h2>
      <p className="text-sm text-gray-500 text-justify">Delirium is a detrimental mental condition often seen in older, hospitalized patients and is currently hard to predict. In this study, we leverage electronic health records (EHR) to identify 7,492 UCSF patients and 19,...</p>
      <div className="flex flex-row items-center gap-x-4 p-2">
        <Tag className="bg-blue-500 text-white text-xs px-2 py-1">Research</Tag>
        <Tag className="bg-green-500 text-white text-xs px-2 py-1">Science</Tag>
        <label className="text-gray-500 text-sm my-2">June 2024 - 2.5 Rating</label>
      </div>
      
</div>

    </div>
    <div className="text-sm border-t flex flex-row gap-x-2 text-gray-700 py-2 items-center">
        <button variant="outline" className="border border-blue-600 rounded-xl hover:bg-blue-50 text-blue-600 p-2 text-xs">Download</button>
        <button variant="outline" className="rounded-xl text-blue-600 p-2 text-xs">Share</button>
      </div>
    </div>
  );
}

// RecentAdded component
function RecentAdded({ items }) {
  return (
    <Card className="border border-gray-300">
      <CardHeader>
        <h2 className="text-lg font-medium">Recently Added</h2>
      </CardHeader>
      <CardContent>
        <ul className="text-sm text-gray-700">
          {items.map((item) => (
            <li key={item.id} className="mb-1">
              {item.title} <span className="text-gray-500">({item.date})</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// Recommendations component
function Recommendations({ items }) {
  return (
    <Card className="border border-gray-300">
      <CardHeader>
        <h2 className="text-lg font-medium">Recommended</h2>
      </CardHeader>
      <CardContent>
        <ul className="text-sm text-gray-700">
          {items.map((item) => (
            <li key={item.id} className="mb-1">
              {item.title}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// Main Home component
export default function Home() {
  return (
    <div className="max-w-[79rem]  mx-auto my-4 bg-gray-100">
      <div className="container mx-auto p-4 flex">


        {/* Middle Column: Document List */}
        <div className="w-4/6 p-2">
          <h1 className="text-xl font-bold text-black mb-3">Document List</h1>
          <div className="space-y-3">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} title={doc.title} author={doc.author} date={doc.date} />
            ))}
          </div>
        </div>

        {/* Right Column: Recent and Recommended */}
        <div className="w-2/6 p-2 space-y-4">
        <h1 className="text-xl font-bold text-black mb-3">Updates</h1>

          <RecentAdded items={recentAdded} />
          <Recommendations items={recommendations} />
        </div>
      </div>
    </div>
  );
}
