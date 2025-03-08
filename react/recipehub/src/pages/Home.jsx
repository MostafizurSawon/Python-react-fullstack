
import Slider from "react-slick";

function Home() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div className="my-5 pt-5">
      <div className="container">
        <h1>Trending Recipes</h1>
        <Slider {...settings}>
          <div>
            <h3>Recipe 1</h3>
          </div>
          <div>
            <h3>Recipe 2</h3>
          </div>
          <div>
            <h3>Recipe 3</h3>
          </div>
          <div>
            <h3>Recipe 4</h3>
          </div>
        </Slider>
      </div>
    </div>
  );
}

export default Home;



// npm install react-slick slick-carousel
