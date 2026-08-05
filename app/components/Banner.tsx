// Copyright © MJMDG 2026
interface BannerProps {
  image: string;
  alt?: string;
  transparent?: boolean;
}

export default function Banner({ image, alt = "Banner", transparent = false }: BannerProps) {
  return (
    <div className={transparent ? "bannerContainer bannerContainer--transparent" : "bannerContainer"}>
      <img src={image} alt={alt} style={{ height: "100%", objectFit: "contain" }} />
    </div>
  );
}
