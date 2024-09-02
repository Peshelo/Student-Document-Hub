"use client";
import FooterBar from "@/components/FooterBar";
import Login from "@/components/Login";
import TopHeader from "@/components/TopHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge, Skeleton, Select, Input, message } from "antd";
import { Tag, Heart, ThumbsUp, ThumbsDown, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import Cookie from 'js-cookie';
import ViewPdf from "@/components/view-pdf/viewPdf";

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

function DocumentCard({ document, handleLike, handleDislike }) {
  const token = Cookie.get('token');
  const [isView, setIsView] = useState(false)
  const renderPopContent = (uri) => {

    if (!uri) return <p>No document found</p>

    if (uri.toString().includes('pdf')) {
      return <div onClick={() => setIsView(!isView)} className="top-0 fixed w-screen h-screen z-20 left-0 flex flex-row justify-center items-center backdrop-blur-sm overflow-y-auto">
        <div onClick={(e) => e.stopPropagation()}>
          <ViewPdf pdfUrl={`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/${uri}`} />
        </div>
      </div>
    } else {
      return <div onClick={() => setIsView(!isView)} className="bg-white fixed w-screen h-screen  z-20  max-md:h-full max-md:w-full overflow-y-auto">
        <img onClick={(e) => e.stopPropagation()} src={`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/${uri}`} alt="Proof of Payment" className="mb-4 w-full" />
      </div>
    }
  };

  const like = async () => {
    try {
      const response = await fetch('http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/likes', {
        method: 'POST',
        body: JSON.stringify({ resourceId: document.id, likeType: "LIKE" }),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const updatedDocument = await response.json();
        message.success('Document liked');
        handleLike(updatedDocument);
      }
    } catch (error) {
      console.error('Failed to like document:', error);
    }
  };

  const dislike = async () => {
    try {
      const response = await fetch('http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/likes', {
        method: 'POST',
        body: JSON.stringify({ resourceId: document.id, likeType: "DISLIKE" }),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const updatedDocument = await response.json();
        message.success('Document disliked');
        handleDislike(updatedDocument);
      }
    } catch (error) {
      console.error('Failed to dislike document:', error);
    }
  };

  const share = (platform) => {
    const url = `http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/${document.uri}`;
    const text = `Check out this document: ${document.title}`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank', 'noopener,noreferrer');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank', 'noopener,noreferrer');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank', 'noopener,noreferrer');
        break;
      case 'whatsapp':
        window.open(`https://api.whatsapp.com/send?text=${encodedText} ${encodedUrl}`, '_blank', 'noopener,noreferrer');
        break;
      default:
        break;
    }
  };

  return (
    <div className="border bg-white border-gray-300 p-4 flex flex-col">
      <div className="flex flex-row items-center gap-x-2 py-2 border-b">
        <Avatar>
          <AvatarFallback>{document?.userAccount?.fullName.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <p className="text-sm text-blue-500">{document?.userAccount?.fullName}</p>
      </div>
      <div className="flex flex-row justify-between gap-x-2 items-center">
        <div>
          <h2 className="text-lg text-black font-medium">{document?.title}</h2>
          <p className="text-sm text-gray-500 text-justify">{document?.description}...</p>
          <div className="flex flex-row items-center gap-x-4 p-2">
            <Tag className="bg-green-500 text-white text-xs px-2 py-1">Tags</Tag>
            <p>{document?.keywords.includes(',') ? <div>
              {document?.keywords.split(',').map((keyword) => (
                <label key={keyword} className="bg-gray-100 text-gray-500 mr-1 rounded-md text-xs px-2 py-1">{keyword}</label>
              ))}
            </div>
              :
              <p className="bg-gray-100 text-gray-500 rounded-md text-xs px-2 py-1">{document?.keywords.toString()}</p>
              }
              </p>

          </div>
          <label className="text-gray-500 my-4 text-xs">Posted: {document.createdOn}</label>
        </div>
        <Image src="/assets/images/pdf.png" width={60} height={60} alt="PDF icon" className="ml-4 object-contain" />
      </div>
      <div className="text-sm border-t flex flex-row gap-x-2 text-gray-700 py-2 items-center">

{/* <button 
  className="border border-blue-600 rounded-xl hover:bg-blue-50 text-blue-600 p-2 text-xs" 
  onClick={() => downloadPDF(`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/${document.uri}`, document.title)}
>
  Download
</button> */}
        <Link target="_blank" href={`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/${document.uri}`} className="border border-blue-600 rounded-xl hover:bg-blue-50 text-blue-600 p-2 text-xs">Download</Link>
        {/* <button className="border border-blue-600 rounded-xl hover:bg-blue-50 text-blue-600 p-2 text-xs" onClick={downloadPDF(`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/${document.uri}`, document.title)}>Download</button> */}
        <button onClick={() => setIsView(!isView)} className="border border-orange-600 rounded-xl hover:bg-blue-50 text-orange-600 p-2 text-xs">View</button>
        <button className="rounded-xl text-blue-600 p-2 text-xs flex items-center gap-x-1" onClick={() => share('facebook')}>
          <Share2 className="text-blue-600" size={10} /> Facebook
        </button>
        <button className="rounded-xl text-green-600 p-2 text-xs flex items-center gap-x-1" onClick={() => share('whatsapp')}>
          <Share2 size={10} className="text-green-600" /> WhatsApp
        </button>
        <div className="flex flex-row items-center bg-gray-50 p-2 border rounded-xl gap-x-2 ml-auto">
          <button onClick={like} className="flex flex-row gap-x-1 items-center text-green-500">
            {document?.likes.length} <ThumbsUp />
          </button>
          <div className="border-r h-6 border-gray-300"></div>
          <button onClick={dislike} className="flex flex-row gap-x-1 items-center text-red-500">
            <ThumbsDown />
          </button>
        </div>
      </div>

      {isView &&
        <p>{renderPopContent(document.uri)}</p>
      }


    </div>
  );
}

// RecentAdded component with skeleton loading
const RecentAdded = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      const token = Cookie.get('token'); // Retrieve the token from cookies
      try {
        const response = await fetch('http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/resources/student?pageNumber=0&pageSize=2&sortBy=createdOn&sortDir=desc', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setItems(data.content); // Extract items from the response
      } catch (error) {
        setError(error.message);
        message.error('Failed to fetch recent items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return <Skeleton active paragraph={{ rows: 3 }} />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
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
              <Link target="_blank" href={`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/${document.uri}`}>{item.title}</Link>  <span className="text-gray-500">({item.createdOn.split('T')[0]})</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
const Recommendations = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/resource-category/preferred?pageNumber=0&pageSize=5',
          {
            headers: {
              'Authorization': `Bearer ${Cookie.get('token')}`
            }
          }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        setError(error.message);
        message.error('Failed to fetch recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return <Skeleton active paragraph={{ rows: 3 }} />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
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
              <Link href={`http://localhost:3000/?categoryId=${item.id}`}>
                <label className="text-blue-600 text-sm hover:underline">{item.name}</label>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};



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
  const token = Cookie.get('token');

  const fetchDocuments = async (searchParam = "", categoryId = null) => {
    try {
      setLoading(true);
      const categoryFilter = categoryId ? `&categoryId=${categoryId}` : "";
      const response = await fetch(`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/resources/student?pageNumber=0&pageSize=1000&sortBy=createdOn&sortDir=desc${categoryFilter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setDocuments(data.content);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await fetch("http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/resource-category?pageNumber=0&pageSize=1000", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCategories(data.content);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleLike = (updatedDocument) => {
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.id === updatedDocument.id ? updatedDocument : doc
      )
    );
  };

  const handleDislike = (updatedDocument) => {
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.id === updatedDocument.id ? updatedDocument : doc
      )
    );
  };


  const renderPopContent = (uri) => {

    if (!uri) return <p>No document found</p>;

    if (uri.toString().includes('pdf')) {
      return <div className="bg-white w-full z-20 h-1/2 max-md:w-full">
        <ViewPdf pdfUrl={`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/${uri}`} />
      </div>
    } else {
      return <div className="bg-white z-20 w-full h-[500px] max-md:h-full max-md:w-full overflow-y-auto">
        <img src={`http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8087/${uri}`} alt="Proof of Payment" className="mb-4 w-full" />

      </div>
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
    <>
      <TopHeader />
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
                  <>
                    <DocumentCard key={doc.id} document={doc} handleLike={handleLike} handleDislike={handleDislike} />
                  </>

                ))
              )}
            </div>
          </div>

          {/* Right Column: Recent and Recommended */}
          <div className="w-full space-y-2 md:w-1/6">
            <h2 className="text-lg mb-5 font-medium">Recommendations</h2>
            <Suspense>
              <Recommendations items={recommendations} loading={loading} />
            </Suspense>
            <Suspense>
              <RecentAdded items={recentAdded} loading={loading} />
            </Suspense>
          </div>
        </div>
      </div>
      <FooterBar />
    </>
  );
}
