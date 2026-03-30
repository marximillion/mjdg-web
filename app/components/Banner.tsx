interface BannerProps {
  image: string;
  alt?: string;
}

export default function Banner({ image, alt = "Banner" }: BannerProps) {
  return (
    <div className="bannerContainer">
      <img src={image} alt={alt} style={{ height: "100%", objectFit: "contain" }} />
    </div>
  );
}
