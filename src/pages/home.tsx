import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Skeleton } from "../components/loader";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";
import videoCover from "../assets/videos/cover.mp4";
import { FaAnglesDown, FaHeadset } from "react-icons/fa6";
import { motion } from "framer-motion";
import { Slider } from "6pp";
import { TbTruckDelivery } from "react-icons/tb";
import { LuShieldCheck } from "react-icons/lu";
const clients = [
  {
    src: "https://cdn.worldvectorlogo.com/logos/nike-6.svg",
    alt: "Nike",
  },
   {
    src: "https://cdn.worldvectorlogo.com/logos/xiao-mi.svg",
    alt: "Xiaomi",
  },
  {
    src: "https://cdn.worldvectorlogo.com/logos/hp-2012.svg",
    alt: "Hp",
  },
  {
    src: "https://cdn.worldvectorlogo.com/logos/microsoft-6.svg",
    alt: "Microsoft",
  },
   {
    src: "https://cdn.worldvectorlogo.com/logos/canva-wordmark-2.svg",
    alt: "canva",
  },
  {
    src: "https://cdn.worldvectorlogo.com/logos/coca-cola-2021.svg",
    alt: "Coca-Cola",
  },
   {
    src: "https://cdn.worldvectorlogo.com/logos/sass-1.svg",
    alt: "sass",
  },
  {
    src: "https://cdn.worldvectorlogo.com/logos/redux.svg",
    alt: "redux",
  },
  {
    src: "https://cdn.worldvectorlogo.com/logos/typescript-2.svg",
    alt: "typescript",
  },
 
  {
    src: "https://cdn.worldvectorlogo.com/logos/firebase-1.svg",
    alt: "firebase",
  },
  {
    src: "https://cdn.worldvectorlogo.com/logos/gitlab.svg",
    alt: "gitlab",
  },

  {
    src: "https://cdn.worldvectorlogo.com/logos/mongodb-icon-1-1.svg",
    alt: "MongoDB",
  },
  {
    src: "https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg",
    alt: "Node.js",
  },
  {
    src: "https://cdn.worldvectorlogo.com/logos/javascript-r.svg",
    alt: "JavaScript",
  },
  {
    src: "https://cdn.worldvectorlogo.com/logos/redis.svg",
    alt: "Redis",
  },

  {
    src: "https://cdn.worldvectorlogo.com/logos/mysql-logo-pure.svg",
    alt: "MySQL",
  },
  {
    src: "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg",
    alt: "Slack",
  },
];

const banners = [
  "https://res.cloudinary.com/dj5q966nb/image/upload/v1719253445/rmbjpuzctjdbtt8hewaz.png",
  "https://res.cloudinary.com/dj5q966nb/image/upload/v1719253433/ticeufjqvf6napjhdiee.png",
];
const categories = [
  "Electronics",
  "Mobiles",
  "Laptops",
  "Books",
  "Fashion",
  "Appliances",
  "Furniture",
  "Home Decor",
  "Grocery",
  "Beauty",
  "Toys",
  "Fitness",
];

const services = [
  {
    icon: <TbTruckDelivery />,
    title: "FREE AND FAST DELIVERY",
    description: "Free delivery for all orders over $200",
  },
  {
    icon: <LuShieldCheck />,
    title: "SECURE PAYMENT",
    description: "100% secure payment",
  },
  {
    icon: <FaHeadset />,
    title: "24/7 SUPPORT",
    description: "Get support 24/7",
  },
];

const Home = () => {
  const { data, isError, isLoading } = useLatestProductsQuery("");
  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  if (isError) toast.error("Cannot Fetch the Products");

  const coverMessage =
    "Fashion isn't just clothes; it's a vibrant language. Silhouettes and textures speak volumes, a conversation starter with every bold print. It's a way to tell our story, a confidence booster, or a playful exploration. From elegance to rebellion, fashion lets us navigate the world in style.".split(
      " "
    );

  return (
    <>
      <div className="home">
        <section></section>

        <div>
          <aside>
            <h1>Categories</h1>
            <ul>
              {categories.map((i) => (
                <li key={i}>
                  <Link to={`/search?category=${i.toLowerCase()}`}>{i}</Link>
                </li>
              ))}
            </ul>
          </aside>
          <Slider
            autoplay
            autoplayDuration={1500}
            showNav={false}
            images={banners}
          />
        </div>

        <h1>
          Latest Products
          <Link to="/search" className="findmore">
            More
          </Link>
        </h1>

        <main>
          {isLoading ? (
            <>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} style={{ height: "25rem" }}>
                  <Skeleton width="18.75rem" length={1} height="20rem" />
                  <Skeleton width="18.75rem" length={2} height="1.95rem" />
                </div>
              ))}
            </>
          ) : (
            data?.products?.map((i) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                ProductName={i.ProductName}
                price={i.price}
                stock={i.stock}
                handler={addToCartHandler}
                ProductImage={i.ProductImage}
              />
            ))
          )}
        </main>
      </div>

      <article className="cover-video-container">
        <div className="cover-video-overlay"></div>
        <video autoPlay loop muted src={videoCover} />
        <div className="cover-video-content">
          <motion.h2
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Fashion
          </motion.h2>
          {coverMessage.map((el, i) => (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.25,
                delay: i / 10,
              }}
              key={i}
            >
              {el}{" "}
            </motion.span>
          ))}
        </div>
        <motion.span
          animate={{
            y: [0, 10, 0],
            transition: {
              duration: 1,
              repeat: Infinity,
            },
          }}
        >
          <FaAnglesDown />
        </motion.span>
      </article>

      <article className="our-clients">
        <div>
          <h2>Our Clients</h2>
          <div>
            {clients.map((client, i) => (
              <motion.img
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: i / 20,
                    ease: "circIn",
                  },
                }}
                src={client.src}
                alt={client.alt}
                key={i}
                style={{color:"white"}}
              />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: -100 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                delay: clients.length / 20,
              },
            }}
          >
            Trusted By 100+ Companies in 30+ countries
          </motion.p>
        </div>
      </article>

      <hr
        style={{
          backgroundColor: "rgba(255, 255, 255, 1) ",
          border: "none",
          height: "1px",
        }}
      />

      <article className="our-services">
        <ul>
          {services.map((service, i) => (
            <motion.li
              initial={{ opacity: 0, y: -100 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: i / 20,
                },
              }}
              key={service.title}
            >
              <div>{service.icon}</div>
              <section>
                <h3>{service.title}Y</h3>
                <p>{service.title}</p>
              </section>
            </motion.li>
          ))}
        </ul>
      </article>
    </>
  );
};

export default Home;
