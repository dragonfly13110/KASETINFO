export interface Infographic {
  id: string;
  title: string;
  image: string; // URL or path to image
  summary: string;
  category: string; // Category name or ID
  tags: string[];
  published_date: string; // ISO date string
  full_text_from_ocr?: string; // Optional: full text extracted by OCR
  contentPath: string; // Path to the raw content file (e.g., .json), used as primary ID for fetching
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Markdown content
  category: string;
  tags: string[];
  published_date: string; // ISO date string
  contentPath: string; // Path to the raw content file (e.g., .md), used as primary ID for fetching
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
}

// For API responses or structured content from CMS files
export interface ContentFile<T> {
  title: string;
  image?: string; // For Infographic
  summary?: string; // For Infographic
  category: string;
  tags: string[];
  published_date: string;
  body?: string; // For Article (markdown content)
  full_text_from_ocr?: string; // For Infographic
}
