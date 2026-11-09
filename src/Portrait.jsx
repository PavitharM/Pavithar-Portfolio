const frameUrl = (index, width) => `/portrait/frame-${String(index + 1).padStart(2, '0')}-${width}.webp`;

export default function Portrait() {
  return <div className="portrait-layer">
      <img className="portrait-fallback" src={frameUrl(0, 900)} srcSet={`${frameUrl(0,500)} 500w, ${frameUrl(0,900)} 900w`} sizes="(max-width: 700px) 68vw, 42vw" alt="Pavithar M wearing a black jacket and white shirt" fetchPriority="high"/>
  </div>;
}
