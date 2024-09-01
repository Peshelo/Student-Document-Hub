"use client";
import FooterBar from "@/components/FooterBar";
import Login from "@/components/Login";
import TopHeader from "@/components/TopHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge, Skeleton, Select, Input } from "antd";
import { Tag, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from 'next/navigation';

const { Option } = Select;

// Dummy data for recent additions and recommendations
const recentAdded = [
  { id: 1, title: "New Perspectives in AI", date: "2024-08-27" },
  { id: 2, title: "Quantum Computing Intro", date: "2024-08-26" },
];

const recommendations = [
  { id: 1, title: "Deep Learning for Beginners" },
  { id: 2, title: "Advanced Data Structures" },
];

// Custom DocumentCard component (without using Card component)
function DocumentCard({ document }) {
  return (
    <div className="border bg-white border-gray-300 p-4 flex flex-col">
      <div className="flex flex-row items-center gap-x-2 py-2 border-b">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>{document?.userAccount?.fullname}</AvatarFallback>
        </Avatar>
        <p className="text-sm text-blue-500">{document?.userAccount?.fullname}</p>
      </div>
      <div className="flex flex-row justify-between gap-x-2 items-center">
        <div>
          <h2 className="text-lg text-black font-medium">{document?.title}</h2>
          <p className="text-sm text-gray-500 text-justify">{document?.description}...</p>
          <div className="flex flex-row items-center gap-x-4 p-2">
            <Tag className="bg-green-500 text-white text-xs px-2 py-1">Tags</Tag>
            <Badge color="blue" className="bg-blue-500 text-white text-xs px-2 py-1">{document?.keywords}</Badge>
            <label className="text-gray-500 text-sm my-2">June 2024 - 2.5 Rating</label>
          </div>
        </div>
        <Image src="/assets/images/pdf.png" width={60} height={60} alt="PDF icon" className="ml-4 object-contain" />
      </div>
      <div className="text-sm border-t flex flex-row gap-x-2 text-gray-700 py-2 items-center">
        <Link href={`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/${document.uri}`} className="border border-blue-600 rounded-xl hover:bg-blue-50 text-blue-600 p-2 text-xs">Download</Link>
        <button className="rounded-xl text-blue-600 p-2 text-xs">Share</button>
        <button className="ml-auto"><Heart className="text-red-500" /></button>
      </div>
    </div>
  );
}

// RecentAdded component with skeleton loading
function RecentAdded({ items, loading }) {
  if (loading) {
    return <Skeleton active paragraph={{ rows: 3 }} />;
  }
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

// Recommendations component with skeleton loading
function Recommendations({ items, loading }) {
  if (loading) {
    return <Skeleton active paragraph={{ rows: 3 }} />;
  }
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
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const fetchDocuments = async (searchParam = "", categoryId = null) => {
    try {
      setLoading(true);
      const categoryFilter = categoryId ? `&categoryId=${categoryId}` : "";
      const response = await fetch(`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/resources/search?searchParam=${searchParam}&pageNumber=0&pageSize=10&sortBy=createdOn&sortDir=desc${categoryFilter}`);
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await fetch("http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/resource-category?pageNumber=0&pageSize=10");
      const data = await response.json();
      setCategories(data.content);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    const categoryId = searchParams.get('categoryId');
    const searchParam = searchParams.get('searchParam') || "";
    setSearchTerm(searchParam);
    setSelectedCategory(categoryId);
    fetchDocuments(searchParam, categoryId);
  }, [searchParams]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('searchParam', searchTerm);
    if (selectedCategory) params.set('categoryId', selectedCategory);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="max-w-[79rem] mx-auto my-4 bg-gray-100">
      <div className="container mx-auto p-4 flex flex-col md:flex-row gap-4">
        {/* Left Column: Filters */}
        <div className="md:w-1/6 space-y-2">
          <h1 className="text-lg font-bold text-black mb-3">Filters</h1>
          {loadingCategories ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            <>
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="mb-2"
              />
              <Select
                placeholder="Select Category"
                className="w-full"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                {categories.map(category => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
              <Button onClick={handleSearch} className="mt-2 w-full bg-blue-500 text-white">Search</Button>
            </>
          )}
        </div>

        {/* Middle Column: Document List */}
        <div className="w-full md:w-4/6 p-2">
          <h1 className="text-xl font-bold text-black mb-3">Document List</h1>
          <div className="space-y-3">
            {loading ? (
              <>
                <Skeleton active paragraph={{ rows: 3 }} />
                <Skeleton active paragraph={{ rows: 3 }} />
                <Skeleton active paragraph={{ rows: 3 }} />
              </>
            ) : (
              documents.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))
            )}
          </div>
        </div>

        {/* Right Column: Recent and Recommended */}
        <div className="w-full space-y-2 md:w-1/6">
        <h2 className="text-lg mb-5 font-medium">Recommendations</h2>

          <RecentAdded items={recentAdded} loading={loading} />
          <Recommendations items={recommendations} loading={loading} />
        </div>
      </div>
    </div>
  );
}
