// Tag DTOs

export interface TagDto {
  id: number;
  name: string;
  slug: string;
  postCount?: number;
}

export interface CreateTagDto {
  name: string;
  slug: string;
}

export interface UpdateTagDto {
  name?: string;
  slug?: string;
}
