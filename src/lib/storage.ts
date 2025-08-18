import { supabase } from './supabase'

export class StorageService {
  /**
   * Upload a file to a specific bucket
   */
  static async uploadFile(
    bucket: string,
    path: string,
    file: File,
    options?: {
      cacheControl?: string
      contentType?: string
      upsert?: boolean
    }
  ) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: options?.cacheControl || '3600',
        contentType: options?.contentType || file.type,
        upsert: options?.upsert || false
      })

    if (error) {
      console.error('Upload error:', error)
      throw error
    }

    return data
  }

  /**
   * Get public URL for a file
   */
  static getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return data.publicUrl
  }

  /**
   * Delete a file from storage
   */
  static async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      console.error('Delete error:', error)
      throw error
    }
  }

  /**
   * Upload user avatar
   */
  static async uploadAvatar(userId: string, file: File) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/avatar.${fileExt}`
    
    const data = await this.uploadFile('avatars', fileName, file, {
      upsert: true
    })

    return {
      ...data,
      publicUrl: this.getPublicUrl('avatars', fileName)
    }
  }

  /**
   * Upload post media
   */
  static async uploadPostMedia(userId: string, file: File) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    
    const data = await this.uploadFile('posts', fileName, file)

    return {
      ...data,
      publicUrl: this.getPublicUrl('posts', fileName)
    }
  }

  /**
   * Upload restaurant image
   */
  static async uploadRestaurantImage(restaurantId: string, file: File, type: 'cover' | 'profile') {
    const fileExt = file.name.split('.').pop()
    const fileName = `${restaurantId}/${type}.${fileExt}`
    
    const data = await this.uploadFile('restaurants', fileName, file, {
      upsert: true
    })

    return {
      ...data,
      publicUrl: this.getPublicUrl('restaurants', fileName)
    }
  }

  /**
   * Upload dish image
   */
  static async uploadDishImage(dishId: string, file: File) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${dishId}/image.${fileExt}`
    
    const data = await this.uploadFile('dishes', fileName, file, {
      upsert: true
    })

    return {
      ...data,
      publicUrl: this.getPublicUrl('dishes', fileName)
    }
  }

  /**
   * Upload event image
   */
  static async uploadEventImage(eventId: string, file: File) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${eventId}/image.${fileExt}`
    
    const data = await this.uploadFile('events', fileName, file, {
      upsert: true
    })

    return {
      ...data,
      publicUrl: this.getPublicUrl('events', fileName)
    }
  }

  /**
   * List files in a bucket
   */
  static async listFiles(bucket: string, path?: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path)

    if (error) {
      console.error('List files error:', error)
      throw error
    }

    return data
  }

  /**
   * Create signed URL for private files
   */
  static async createSignedUrl(bucket: string, path: string, expiresIn = 3600) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)

    if (error) {
      console.error('Create signed URL error:', error)
      throw error
    }

    return data
  }
}

// Storage bucket names for easy reference
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  POSTS: 'posts',
  RESTAURANTS: 'restaurants',
  DISHES: 'dishes',
  EVENTS: 'events'
} as const

// Helper function to validate file types
export const validateFileType = (file: File, allowedTypes: string[]) => {
  return allowedTypes.includes(file.type)
}

// Helper function to validate file size (in MB)
export const validateFileSize = (file: File, maxSizeMB: number) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

// Common file validation presets
export const FILE_VALIDATION = {
  IMAGE: {
    types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxSize: 5 // 5MB
  },
  AVATAR: {
    types: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 2 // 2MB
  },
  VIDEO: {
    types: ['video/mp4', 'video/webm', 'video/ogg'],
    maxSize: 50 // 50MB
  }
} as const