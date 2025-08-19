// Asset verification utility
import LikLogoHeart from '@/assets/images/Lik_Logo_Heart_1.0.png';
import BookmarkIcon from '@/assets/images/bookmark_icon.svg';
import CommentIcon from '@/assets/images/comment_icon.svg';
import ShareIcon from '@/assets/images/share_icon1.svg';
import HeartIcon from '@/assets/images/heart_icon.svg';
import unselectedFireIcon from '@/assets/images/unselected_fire_icon.png';
import likLogo from '@/assets/images/lik.png';
import ad1 from '@/assets/images/ad1.png';
import ad2 from '@/assets/images/ad2.png';
import ad3 from '@/assets/images/ad3.png';

export const assetVerification = {
  LikLogoHeart,
  BookmarkIcon,
  CommentIcon,
  ShareIcon,
  HeartIcon,
  unselectedFireIcon,
  likLogo,
  ad1,
  ad2,
  ad3
};

// Log assets in development to verify they load correctly
if (import.meta.env.DEV) {
  console.log('Asset verification:', assetVerification);
}