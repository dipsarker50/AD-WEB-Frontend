import { AgentInterface } from "./agent";

export type ProductCategory = 
  | 'vegetables' 
  | 'fruits' 
  | 'grains' 
  | 'dairy' 
  | 'meat' 
  | 'seeds'
  | 'other';

export interface ProductInterface {
  id: number;
  name: string;
  description?: string;
  price: number;
  unit?: string; // 'kg', 'piece', 'dozen', 'liter'
  stock: number;
  category?: string;
  imageUrl?: string;
  agentId: number;
  agent: AgentInterface;
  
  rating?: number; // Average rating (0-5)
  reviewCount?: number;
  discount?: number; // Percentage discount (0-100)
  
  isOrganic?: boolean;
  location?: string;
  harvestDate?: Date | string;
  expiryDate?: Date | string;
  
  tags?: string[]; 
  
  minOrderQuantity?: number ;
  maxOrderQuantity?: number;
  isAvailable?: boolean;
  
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductInterface {
  name: string;
  description?: string;
  price: number;
  unit?: string;
  stock: number;
  category?: string;
  imageUrl?: string;
  productImage?: string; 
  agentId: number;
  
  rating?: number;
  reviewCount?: number;
  discount?: number;
  isOrganic?: boolean;
  location?: string;
  harvestDate?: Date | string;
  expiryDate?: Date | string;
  tags?: string[];
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  isAvailable?: boolean;
}

export interface UpdateProductInterface {
  name?: string;
  description?: string;
  price?: number;
  unit?: string;
  stock?: number;
  category?: string;
  imageUrl?: string;
  productImage?: string;
  agentId?: number;
  rating?: number;
  reviewCount?: number;
  discount?: number;
  isOrganic?: boolean;
  location?: string;
  harvestDate?: Date | string;
  expiryDate?: Date | string;
  tags?: string[];
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  isAvailable?: boolean;
}

export interface ProductCardData {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  cardWidth?: string;
  imageUrl?: string;
  unit?: string;
  discount?: number;
  rating?: number;
  isOrganic?: boolean;
}
