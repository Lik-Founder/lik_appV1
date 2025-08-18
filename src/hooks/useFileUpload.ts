import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface UploadOptions {
  bucket: string
  folder?: string
  maxSizeMB?: number
  allowedTypes?: string[]
}

export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const uploadFile = async (
    file: File,
    options: UploadOptions
  ): Promise<string | null> => {
    try {
      setUploading(true)
      setProgress(0)

      // Validate file size
      const maxSize = (options.maxSizeMB || 10) * 1024 * 1024 // Convert to bytes
      if (file.size > maxSize) {
        toast.error(`File size must be less than ${options.maxSizeMB || 10}MB`)
        return null
      }

      // Validate file type
      if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
        toast.error('File type not allowed')
        return null
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const folderPath = options.folder ? `${options.folder}/` : ''
      const filePath = `${folderPath}${fileName}`

      // Upload file
      const { data, error } = await supabase.storage
        .from(options.bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      setProgress(100)

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(options.bucket)
        .getPublicUrl(filePath)

      return publicUrlData.publicUrl
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Failed to upload file')
      return null
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const uploadAvatar = async (file: File) => {
    return uploadFile(file, {
      bucket: 'avatars',
      maxSizeMB: 5,
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    })
  }

  const uploadPostMedia = async (file: File) => {
    return uploadFile(file, {
      bucket: 'posts',
      maxSizeMB: 10,
      allowedTypes: [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/webp',
        'video/mp4',
        'video/webm'
      ]
    })
  }

  const uploadRestaurantImage = async (file: File, restaurantId: string) => {
    return uploadFile(file, {
      bucket: 'restaurants',
      folder: restaurantId,
      maxSizeMB: 5,
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    })
  }

  const deleteFile = async (bucket: string, path: string) => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])

      if (error) throw error
      return true
    } catch (error: any) {
      console.error('Delete error:', error)
      toast.error(error.message || 'Failed to delete file')
      return false
    }
  }

  return {
    uploadFile,
    uploadAvatar,
    uploadPostMedia,
    uploadRestaurantImage,
    deleteFile,
    uploading,
    progress
  }
}

// Helper function to extract file path from Supabase URL
export function extractFilePathFromUrl(url: string, bucket: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const bucketIndex = pathParts.indexOf(bucket)
    
    if (bucketIndex === -1) return null
    
    return pathParts.slice(bucketIndex + 1).join('/')
  } catch {
    return null
  }
}

// Helper function to generate thumbnails for images
export function generateThumbnail(file: File, maxWidth: number = 300): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      const ratio = img.width / img.height
      const width = Math.min(maxWidth, img.width)
      const height = width / ratio

      canvas.width = width
      canvas.height = height

      // Draw resized image
      ctx?.drawImage(img, 0, 0, width, height)

      // Convert to blob
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to generate thumbnail'))
          return
        }

        const thumbnailFile = new File([blob], `thumb_${file.name}`, {
          type: file.type,
          lastModified: Date.now()
        })

        resolve(thumbnailFile)
      }, file.type, 0.8)
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

// Helper function to validate image dimensions
export function validateImageDimensions(
  file: File,
  minWidth?: number,
  minHeight?: number,
  maxWidth?: number,
  maxHeight?: number
): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    
    img.onload = () => {
      let valid = true
      
      if (minWidth && img.width < minWidth) valid = false
      if (minHeight && img.height < minHeight) valid = false
      if (maxWidth && img.width > maxWidth) valid = false
      if (maxHeight && img.height > maxHeight) valid = false
      
      resolve(valid)
    }
    
    img.onerror = () => resolve(false)
    img.src = URL.createObjectURL(file)
  })
}