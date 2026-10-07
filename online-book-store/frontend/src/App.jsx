import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  BookOpen,
  Search,
  ShoppingBag,
  UserRound,
  ChevronDown,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowUpRight,
  X,
  Menu,
  Pencil,
  Package,
  Sparkles,
  Heart,
  Star,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import "./App.css";

const API_URL = "http://localhost:5000/api/books";

const demoBooks = [
  {
    _id: "demo-1",
    title: "The Midnight Library",
    author: "Matt Haig",
    category: "Fiction",
    price: 499,
    quantity: 12,
    description:
      "A beautiful story about choices, regrets, possibilities and finding meaning in life.",
    image:
      "https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg",
  },
  {
    _id: "demo-2",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Help",
    price: 599,
    quantity: 15,
    description:
      "An easy and proven way to build good habits and break bad ones.",
    image:
      "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
  },
  {
    _id: "demo-3",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Finance",
    price: 449,
    quantity: 10,
    description:
      "Timeless lessons on wealth, greed, happiness and making better financial decisions.",
    image:
      "https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg",
  },
  {
    _id: "demo-4",
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    price: 799,
    quantity: 8,
    description:
      "A practical guide to writing clean, readable and maintainable software.",
    image:
      "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg",
  },
  {
    _id: "demo-5",
    title: "Ikigai",
    author: "Héctor García",
    category: "Self Help",
    price: 399,
    quantity: 20,
    description:
      "A thoughtful exploration of the Japanese concept of finding purpose and happiness.",
    image:
      "https://covers.openlibrary.org/b/isbn/9780143130727-L.jpg",
  },
  {
    _id: "demo-6",
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    category: "Finance",
    price: 499,
    quantity: 14,
    description:
      "A classic personal finance book about money, investing and financial independence.",
    image:
      "https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg",
  },
];

function App() {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [page, setPage] = useState("home");
  const [selectedBook, setSelectedBook] = useState(null);

  const [loading, setLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [usingDemoData, setUsingDemoData] = useState(false);

  const [editingBook, setEditingBook] = useState(null);
  const [showBookForm, setShowBookForm] = useState(false);

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [toast, setToast] = useState("");

  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2200);
  };

  const fetchBooks = async () => {
    setLoading(true);

    try {
      const response = await axios.get(API_URL);

      if (response.data && response.data.length > 0) {
        setBooks(response.data);
        setUsingDemoData(false);
      } else {
        setBooks(demoBooks);
        setUsingDemoData(true);
      }
    } catch (error) {
      setBooks(demoBooks);
      setUsingDemoData(true);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const values = books.map((book) => book.category).filter(Boolean);
    return ["All", ...new Set(values)];
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || book.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [books, search, category]);

  const totalCartItems = cart.reduce(
    (total, item) => total + item.cartQuantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.cartQuantity,
    0
  );

  const isWishlisted = (bookId) => {
    return wishlist.some((book) => book._id === bookId);
  };

  const toggleWishlist = (book) => {
    if (isWishlisted(book._id)) {
      setWishlist((prev) =>
        prev.filter((item) => item._id !== book._id)
      );
      showToast("Removed from favourites");
    } else {
      setWishlist((prev) => [...prev, book]);
      showToast("Added to favourites ❤️");
    }
  };

  const addToCart = (book) => {
    if (book.quantity <= 0) {
      showToast("This book is currently out of stock");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item._id === book._id);

      if (existing) {
        if (existing.cartQuantity >= book.quantity) {
          return prev;
        }

        return prev.map((item) =>
          item._id === book._id
            ? {
                ...item,
                cartQuantity: item.cartQuantity + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...book,
          cartQuantity: 1,
        },
      ];
    });

    showToast("Added to cart 🛒");
  };

  const updateCartQuantity = (id, change) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item._id !== id) return item;

          const newQuantity = item.cartQuantity + change;

          if (newQuantity <= 0) return null;

          if (newQuantity > item.quantity) {
            showToast("Maximum available quantity reached");
            return item;
          }

          return {
            ...item,
            cartQuantity: newQuantity,
          };
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
    showToast("Removed from cart");
  };

  const goHome = () => {
    setPage("home");
    setSelectedBook(null);
    setSearch("");
    setCategory("All");
    setShowMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDetails = (book) => {
    setSelectedBook(book);
    setPage("details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openAdmin = () => {
    setPage("admin");
    setShowMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCart = () => {
    setPage("cart");
    setShowMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCheckout = () => {
    if (cart.length === 0) {
      showToast("Your cart is empty");
      return;
    }

    setPage("checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startAddBook = () => {
    setEditingBook(null);

    setForm({
      title: "",
      author: "",
      category: "",
      price: "",
      quantity: "",
      description: "",
      image: "",
    });

    setShowBookForm(true);
  };

  const startEditBook = (book) => {
    setEditingBook(book);

    setForm({
      title: book.title || "",
      author: book.author || "",
      category: book.category || "",
      price: book.price || "",
      quantity: book.quantity || "",
      description: book.description || "",
      image: book.image || "",
    });

    setShowBookForm(true);
  };

  const handleBookFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveBook = async (e) => {
    e.preventDefault();

    if (usingDemoData) {
      showToast("Connect MongoDB to manage real books");
      return;
    }

    try {
      if (editingBook) {
        const response = await axios.put(
          `${API_URL}/${editingBook._id}`,
          {
            ...form,
            price: Number(form.price),
            quantity: Number(form.quantity),
          }
        );

        setBooks((prev) =>
          prev.map((book) =>
            book._id === editingBook._id ? response.data : book
          )
        );

        showToast("Book updated successfully");
      } else {
        const response = await axios.post(API_URL, {
          ...form,
          price: Number(form.price),
          quantity: Number(form.quantity),
        });

        setBooks((prev) => [response.data, ...prev]);

        showToast("Book added successfully");
      }

      setShowBookForm(false);
      setEditingBook(null);
    } catch (error) {
      showToast("Unable to save book");
    }
  };

  const deleteBook = async (id) => {
    if (usingDemoData) {
      showToast("Connect MongoDB to delete books");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`);

      setBooks((prev) => prev.filter((book) => book._id !== id));

      setCart((prev) => prev.filter((item) => item._id !== id));

      setWishlist((prev) => prev.filter((item) => item._id !== id));

      showToast("Book deleted successfully");
    } catch (error) {
      showToast("Unable to delete book");
    }
  };

  const placeOrder = (e) => {
    e.preventDefault();

    if (
      !checkoutForm.name ||
      !checkoutForm.email ||
      !checkoutForm.phone ||
      !checkoutForm.address ||
      !checkoutForm.city ||
      !checkoutForm.pincode
    ) {
      showToast("Please fill all delivery details");
      return;
    }

    setOrderPlaced(true);
    setCart([]);
  };

  const handleCheckoutChange = (e) => {
    const { name, value } = e.target;

    setCheckoutForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="app">
      <Navbar
        page={page}
        cartCount={totalCartItems}
        wishlistCount={wishlist.length}
        onHome={goHome}
        onCart={openCart}
        onAdmin={openAdmin}
        onWishlist={() => setPage("wishlist")}
        mobileOpen={showMobileMenu}
        setMobileOpen={setShowMobileMenu}
      />

      {page === "home" && (
        <HomePage
          books={books}
          filteredBooks={filteredBooks}
          categories={categories}
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          loading={loading}
          usingDemoData={usingDemoData}
          onDetails={openDetails}
          onAddToCart={addToCart}
          onWishlist={toggleWishlist}
          isWishlisted={isWishlisted}
          onCategory={(cat) => {
            setCategory(cat);
            document
              .getElementById("collections")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      )}

      {page === "details" && selectedBook && (
        <BookDetails
          book={selectedBook}
          onBack={goHome}
          onAddToCart={addToCart}
          onWishlist={toggleWishlist}
          isWishlisted={isWishlisted(selectedBook._id)}
        />
      )}

      {page === "cart" && (
        <CartPage
          cart={cart}
          cartTotal={cartTotal}
          onUpdate={updateCartQuantity}
          onRemove={removeFromCart}
          onCheckout={openCheckout}
          onContinue={goHome}
        />
      )}

      {page === "checkout" && (
        <CheckoutPage
          cart={cart}
          cartTotal={cartTotal}
          checkoutForm={checkoutForm}
          onChange={handleCheckoutChange}
          onSubmit={placeOrder}
          orderPlaced={orderPlaced}
          onHome={goHome}
        />
      )}

      {page === "wishlist" && (
        <WishlistPage
          wishlist={wishlist}
          onDetails={openDetails}
          onAddToCart={addToCart}
          onWishlist={toggleWishlist}
          onContinue={goHome}
        />
      )}

      {page === "admin" && (
        <AdminPage
          books={books}
          usingDemoData={usingDemoData}
          editingBook={editingBook}
          showBookForm={showBookForm}
          form={form}
          onStartAdd={startAddBook}
          onStartEdit={startEditBook}
          onDelete={deleteBook}
          onFormChange={handleBookFormChange}
          onSave={saveBook}
          onCancelForm={() => {
            setShowBookForm(false);
            setEditingBook(null);
          }}
        />
      )}

      {toast && (
        <div className="toast">
          <Check size={18} />
          <span>{toast}</span>
        </div>
      )}

      <Footer onHome={goHome} />
    </div>
  );
}

/* ================= NAVBAR ================= */

function Navbar({
  page,
  cartCount,
  wishlistCount,
  onHome,
  onCart,
  onAdmin,
  onWishlist,
  mobileOpen,
  setMobileOpen,
}) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button className="brand" onClick={onHome}>
          <span className="brand-icon">
            <BookOpen size={21} />
          </span>

          <span>
            Book<span>ora</span>
          </span>
        </button>

        <nav className={`nav-links ${mobileOpen ? "mobile-active" : ""}`}>
          <button
            className={page === "home" ? "active" : ""}
            onClick={onHome}
          >
            Home
          </button>

          <button
            onClick={() => {
              onHome();

              setTimeout(() => {
                document
                  .getElementById("collections")
                  ?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
          >
            Collections
          </button>

          <button
            className={page === "wishlist" ? "active" : ""}
            onClick={onWishlist}
          >
            Favourites
            {wishlistCount > 0 && (
              <span className="nav-count">{wishlistCount}</span>
            )}
          </button>

          <button
            className={page === "admin" ? "active" : ""}
            onClick={onAdmin}
          >
            Admin
          </button>
        </nav>

        <div className="nav-actions">
          <button className="nav-icon-button" title="Profile">
            <UserRound size={19} />
          </button>

          <button
            className="nav-icon-button cart-button"
            onClick={onCart}
            title="Shopping cart"
          >
            <ShoppingBag size={20} />

            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </button>

          <button
            className="mobile-menu-button"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ================= HOME ================= */

function HomePage({
  books,
  filteredBooks,
  categories,
  search,
  setSearch,
  category,
  setCategory,
  loading,
  usingDemoData,
  onDetails,
  onAddToCart,
  onWishlist,
  isWishlisted,
  onCategory,
}) {
  const featuredBooks = books.slice(0, 4);

  return (
    <main>
      <section className="premium-hero">
        <div className="premium-hero-content">
          <div className="hero-tag">
            <Sparkles size={15} />
            Curated books for curious minds
          </div>

          <h1>
            Books that
            <br />
            <span>inspire your journey.</span>
          </h1>

          <p>
            Discover stories, ideas and knowledge that stay with you long
            after you turn the final page.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-button"
              onClick={() =>
                document
                  .getElementById("collections")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Collection
              <ArrowRight size={18} />
            </button>

            <button
              className="secondary-button"
              onClick={() =>
                document
                  .getElementById("featured")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Featured Books
            </button>
          </div>

          <div className="premium-hero-stats">
            <div>
              <strong>{books.length}+</strong>
              <span>Books</span>
            </div>

            <div>
              <strong>{categories.length - 1}+</strong>
              <span>Genres</span>
            </div>

            <div>
              <strong>4.9</strong>
              <span>Reader Rating</span>
            </div>
          </div>
        </div>

        <div className="premium-hero-visual">
          <div className="hero-glow"></div>

          <div className="premium-book-stack">
            <div className="premium-book book-one">
              <div className="book-cover-small">IDEAS</div>
            </div>

            <div className="premium-book book-two">
              <div className="book-cover-small">STORIES</div>
            </div>

            <div className="premium-book book-three">
              <div className="book-cover-small">GROWTH</div>
            </div>
          </div>

          <div className="hero-floating-card">
            <Star size={15} fill="currentColor" />
            <div>
              <strong>4.9/5</strong>
              <span>Reader love</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bookora-trust-bar">
        <div>
          <Truck size={21} />
          <span>Fast Delivery</span>
        </div>

        <div>
          <ShieldCheck size={21} />
          <span>Secure Shopping</span>
        </div>

        <div>
          <BookOpen size={21} />
          <span>Curated Collection</span>
        </div>

        <div>
          <RotateCcw size={21} />
          <span>Easy Returns</span>
        </div>
      </section>

      {usingDemoData && (
        <div className="demo-notice home-notice">
          Showing demo books because the API is currently unavailable.
        </div>
      )}

      <section className="featured-section" id="featured">
        <div className="premium-section-heading">
          <div>
            <span className="section-kicker">HANDPICKED</span>
            <h2>Featured Collection</h2>
            <p>Books worth making space for on your shelf.</p>
          </div>

          <button
            className="text-button"
            onClick={() =>
              document
                .getElementById("collections")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            View all
            <ArrowUpRight size={17} />
          </button>
        </div>

        <div className="featured-books-grid">
          {featuredBooks.map((book) => (
            <FeaturedBookCard
              key={book._id}
              book={book}
              onDetails={onDetails}
              onAddToCart={onAddToCart}
              onWishlist={onWishlist}
              isWishlisted={isWishlisted(book._id)}
            />
          ))}
        </div>
      </section>

      <section className="categories-section">
        <div className="premium-section-heading center-heading">
          <span className="section-kicker">EXPLORE</span>
          <h2>Browse by Genre</h2>
          <p>Find your next favourite from a world of ideas.</p>
        </div>

        <div className="category-cards">
          {categories
            .filter((item) => item !== "All")
            .slice(0, 6)
            .map((item, index) => {
              const count = books.filter(
                (book) => book.category === item
              ).length;

              return (
                <button
                  className="category-card"
                  key={item}
                  onClick={() => onCategory(item)}
                >
                  <div className={`category-card-image category-${index}`}>
                    <div className="category-overlay">
                      <ArrowUpRight size={23} />
                    </div>
                  </div>

                  <div className="category-card-content">
                    <h3>{item}</h3>
                    <span>
                      {count} {count === 1 ? "book" : "books"}
                    </span>
                  </div>
                </button>
              );
            })}
        </div>
      </section>

      <section className="collection-section" id="collections">
        <div className="collection-header">
          <div>
            <span className="section-kicker">THE COLLECTION</span>
            <h2>Find your next read.</h2>
            <p>
              Showing {filteredBooks.length}{" "}
              {filteredBooks.length === 1 ? "book" : "books"}
              {search && ` for "${search}"`}
            </p>
          </div>

          <div className="search-box">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button onClick={() => setSearch("")}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="collection-toolbar">
          <div className="category-filters">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "selected" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your collection...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={42} />
            <h3>No books found</h3>
            <p>Try another title, author or category.</p>

            <button
              className="primary-button"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="book-grid">
            {filteredBooks.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onDetails={onDetails}
                onAddToCart={onAddToCart}
                onWishlist={onWishlist}
                isWishlisted={isWishlisted(book._id)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="why-bookora-section">
        <div className="why-bookora-content">
          <span className="section-kicker">WHY BOOKORA</span>
          <h2>A better way to discover books.</h2>
          <p>
            We believe finding a great book should feel just as enjoyable
            as reading one. Bookora brings together a thoughtfully
            selected collection with a clean and simple shopping
            experience.
          </p>

          <div className="why-points">
            <div>
              <span>01</span>
              <div>
                <h3>Curated Selection</h3>
                <p>Quality books across different interests.</p>
              </div>
            </div>

            <div>
              <span>02</span>
              <div>
                <h3>Simple Experience</h3>
                <p>Search, discover and shop without the clutter.</p>
              </div>
            </div>

            <div>
              <span>03</span>
              <div>
                <h3>Made for Readers</h3>
                <p>Designed around your reading journey.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="why-bookora-card">
          <BookOpen size={45} />
          <span>BOOKORA</span>
          <strong>
            One more
            <br />
            chapter.
          </strong>
          <p>Because every great journey starts with a page.</p>
        </div>
      </section>

      <section className="newsletter-section">
        <div>
          <span className="section-kicker">STAY IN THE LOOP</span>
          <h2>Never miss a good story.</h2>
          <p>
            Get new arrivals, reading inspiration and exclusive updates.
          </p>
        </div>

        <div className="newsletter-form">
          <input type="email" placeholder="Your email address" />
          <button onClick={() => alert("Thanks for subscribing!")}>
            Subscribe
            <ArrowRight size={17} />
          </button>
        </div>
      </section>
    </main>
  );
}

/* ================= FEATURED CARD ================= */

function FeaturedBookCard({
  book,
  onDetails,
  onAddToCart,
  onWishlist,
  isWishlisted,
}) {
  return (
    <article className="featured-book-card">
      <div className="featured-book-image">
        {book.image ? (
          <img src={book.image} alt={book.title} />
        ) : (
          <div className="book-placeholder">
            <BookOpen size={40} />
          </div>
        )}

        <button
          className={`featured-heart ${
            isWishlisted ? "liked" : ""
          }`}
          onClick={() => onWishlist(book)}
        >
          <Heart
            size={18}
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

        <div className="featured-badge">
          Featured
        </div>
      </div>

      <div className="featured-book-content">
        <span className="featured-category">{book.category}</span>

        <h3>{book.title}</h3>

        <p>by {book.author}</p>

        <div className="featured-book-bottom">
          <strong>₹{book.price}</strong>

          <button onClick={() => onDetails(book)}>
            View
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ================= BOOK CARD ================= */

function BookCard({
  book,
  onDetails,
  onAddToCart,
  onWishlist,
  isWishlisted,
}) {
  return (
    <article className="book-card">
      <div className="book-image-wrap">
        {book.image ? (
          <img
            src={book.image}
            alt={book.title}
            className="book-image"
          />
        ) : (
          <div className="book-placeholder">
            <BookOpen size={42} />
          </div>
        )}

        <button
          className={`wishlist-button ${
            isWishlisted ? "liked" : ""
          }`}
          onClick={() => onWishlist(book)}
          title="Add to favourites"
        >
          <Heart
            size={18}
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

        {book.quantity <= 0 && (
          <span className="stock-overlay">Out of stock</span>
        )}
      </div>

      <div className="book-card-content">
        <span className="book-category">{book.category}</span>

        <h3>{book.title}</h3>

        <p className="book-author">{book.author}</p>

        <div className="book-rating">
          <span>
            <Star size={14} fill="currentColor" />
            4.8
          </span>
          <small>120+ reviews</small>
        </div>

        <p className="book-description">
          {book.description}
        </p>

        <div className="book-card-bottom">
          <strong>₹{book.price}</strong>

          <button
            className="add-button"
            disabled={book.quantity <= 0}
            onClick={() => onAddToCart(book)}
          >
            <Plus size={17} />
            Add
          </button>
        </div>

        <button
          className="details-button"
          onClick={() => onDetails(book)}
        >
          View Details
          <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
}

/* ================= DETAILS ================= */

function BookDetails({
  book,
  onBack,
  onAddToCart,
  onWishlist,
  isWishlisted,
}) {
  return (
    <main className="details-page">
      <div className="details-breadcrumb">
        <button onClick={onBack}>Home</button>
        <span>/</span>
        <span>{book.category}</span>
        <span>/</span>
        <strong>{book.title}</strong>
      </div>

      <section className="details-layout">
        <div className="details-image-card">
          {book.image ? (
            <img src={book.image} alt={book.title} />
          ) : (
            <div className="details-placeholder">
              <BookOpen size={80} />
            </div>
          )}

          <button
            className={`details-wishlist ${
              isWishlisted ? "liked" : ""
            }`}
            onClick={() => onWishlist(book)}
          >
            <Heart
              size={20}
              fill={isWishlisted ? "currentColor" : "none"}
            />
            {isWishlisted
              ? "Saved to favourites"
              : "Add to favourites"}
          </button>
        </div>

        <div className="details-content">
          <span className="details-category">
            {book.category}
          </span>

          <h1>{book.title}</h1>

          <p className="details-author">
            Written by <strong>{book.author}</strong>
          </p>

          <div className="details-rating">
            <span className="stars">
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
            </span>

            <strong>4.8</strong>
            <span>120+ reader reviews</span>
          </div>

          <div className="details-price">
            ₹{book.price}
          </div>

          <p className="details-description">
            {book.description}
          </p>

          <div className="details-stock">
            <span className={book.quantity > 0 ? "in-stock" : "out-stock"}>
              <span className="stock-dot"></span>
              {book.quantity > 0
                ? `${book.quantity} copies available`
                : "Currently out of stock"}
            </span>
          </div>

          <div className="details-actions">
            <button
              className="primary-button large-button"
              disabled={book.quantity <= 0}
              onClick={() => onAddToCart(book)}
            >
              <ShoppingBag size={19} />
              Add to Cart
            </button>

            <button
              className={`details-fav-button ${
                isWishlisted ? "liked" : ""
              }`}
              onClick={() => onWishlist(book)}
            >
              <Heart
                size={19}
                fill={isWishlisted ? "currentColor" : "none"}
              />
            </button>
          </div>

          <div className="details-benefits">
            <div>
              <Truck size={21} />
              <div>
                <strong>Fast Delivery</strong>
                <span>Delivered safely to your door</span>
              </div>
            </div>

            <div>
              <ShieldCheck size={21} />
              <div>
                <strong>Secure Checkout</strong>
                <span>Your information stays protected</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ================= WISHLIST ================= */

function WishlistPage({
  wishlist,
  onDetails,
  onAddToCart,
  onWishlist,
  onContinue,
}) {
  return (
    <main className="wishlist-page">
      <div className="page-heading">
        <span className="section-kicker">YOUR COLLECTION</span>
        <h1>Favourite Books</h1>
        <p>Books you want to remember and read later.</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <div className="empty-icon">
            <Heart size={42} />
          </div>

          <h2>Your favourites are empty</h2>

          <p>
            Save books you love and they'll appear here.
          </p>

          <button
            className="primary-button"
            onClick={onContinue}
          >
            Explore Books
            <ArrowRight size={17} />
          </button>
        </div>
      ) : (
        <div className="book-grid wishlist-grid">
          {wishlist.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onDetails={onDetails}
              onAddToCart={onAddToCart}
              onWishlist={onWishlist}
              isWishlisted={true}
            />
          ))}
        </div>
      )}
    </main>
  );
}

/* ================= CART ================= */

function CartPage({
  cart,
  cartTotal,
  onUpdate,
  onRemove,
  onCheckout,
  onContinue,
}) {
  return (
    <main className="cart-page">
      <div className="page-heading">
        <span className="section-kicker">SHOPPING BAG</span>
        <h1>Your Cart</h1>
        <p>Review your books before checking out.</p>
      </div>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <div className="empty-icon">
            <ShoppingBag size={42} />
          </div>

          <h2>Your cart is empty</h2>

          <p>Add some books and come back here to complete your order.</p>

          <button
            className="primary-button"
            onClick={onContinue}
          >
            Browse Books
            <ArrowRight size={17} />
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item._id}>
                <div className="cart-item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.title} />
                  ) : (
                    <BookOpen size={35} />
                  )}
                </div>

                <div className="cart-item-info">
                  <span>{item.category}</span>

                  <h3>{item.title}</h3>

                  <p>{item.author}</p>

                  <strong>₹{item.price}</strong>
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-control">
                    <button onClick={() => onUpdate(item._id, -1)}>
                      <Minus size={15} />
                    </button>

                    <span>{item.cartQuantity}</span>

                    <button onClick={() => onUpdate(item._id, 1)}>
                      <Plus size={15} />
                    </button>
                  </div>

                  <strong>
                    ₹{item.price * item.cartQuantity}
                  </strong>

                  <button
                    className="remove-button"
                    onClick={() => onRemove(item._id)}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>₹{cartTotal}</strong>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <strong>Free</strong>
            </div>

            <div className="summary-row">
              <span>Discount</span>
              <strong>₹0</strong>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <strong>₹{cartTotal}</strong>
            </div>

            <button
              className="primary-button checkout-button"
              onClick={onCheckout}
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </button>

            <button
              className="continue-shopping"
              onClick={onContinue}
            >
              Continue Shopping
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}

/* ================= CHECKOUT ================= */

function CheckoutPage({
  cart,
  cartTotal,
  checkoutForm,
  onChange,
  onSubmit,
  orderPlaced,
  onHome,
}) {
  if (orderPlaced) {
    return (
      <main className="checkout-page">
        <div className="success-card">
          <div className="success-icon">
            <Check size={42} />
          </div>

          <span className="section-kicker">ORDER CONFIRMED</span>

          <h1>Thank you for your order!</h1>

          <p>
            Your Bookora order has been placed successfully.
            This is a demo checkout for your project.
          </p>

          <button
            className="primary-button"
            onClick={onHome}
          >
            Continue Shopping
            <ArrowRight size={17} />
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="page-heading">
        <span className="section-kicker">CHECKOUT</span>
        <h1>Complete Your Order</h1>
        <p>Enter your delivery details to place your order.</p>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={onSubmit}>
          <div className="checkout-card">
            <h2>Delivery Details</h2>

            <div className="checkout-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  name="name"
                  value={checkoutForm.name}
                  onChange={onChange}
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={checkoutForm.email}
                  onChange={onChange}
                  placeholder="you@example.com"
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  name="phone"
                  value={checkoutForm.phone}
                  onChange={onChange}
                  placeholder="10 digit mobile number"
                />
              </div>

              <div className="form-group">
                <label>Pincode</label>
                <input
                  name="pincode"
                  value={checkoutForm.pincode}
                  onChange={onChange}
                  placeholder="400001"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={checkoutForm.address}
                onChange={onChange}
                placeholder="Enter your full delivery address"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                name="city"
                value={checkoutForm.city}
                onChange={onChange}
                placeholder="Enter city"
              />
            </div>
          </div>

          <div className="checkout-card">
            <h2>Payment Method</h2>

            <label className="payment-option">
              <input type="radio" name="payment" defaultChecked />
              <div>
                <strong>Cash on Delivery</strong>
                <span>Pay when your order arrives.</span>
              </div>
            </label>

            <label className="payment-option">
              <input type="radio" name="payment" />
              <div>
                <strong>Online Payment</strong>
                <span>Demo payment option.</span>
              </div>
            </label>
          </div>

          <button className="primary-button checkout-submit">
            Place Order
            <ArrowRight size={18} />
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Your Order</h2>

          {cart.map((item) => (
            <div className="checkout-item" key={item._id}>
              <div>
                <strong>{item.title}</strong>
                <span>
                  Qty: {item.cartQuantity}
                </span>
              </div>

              <strong>
                ₹{item.price * item.cartQuantity}
              </strong>
            </div>
          ))}

          <div className="summary-total">
            <span>Total</span>
            <strong>₹{cartTotal}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}

/* ================= ADMIN ================= */

function AdminPage({
  books,
  usingDemoData,
  editingBook,
  showBookForm,
  form,
  onStartAdd,
  onStartEdit,
  onDelete,
  onFormChange,
  onSave,
  onCancelForm,
}) {
  const [adminSearch, setAdminSearch] = useState("");
  const [adminCategory, setAdminCategory] = useState("All");

  const adminCategories = [
    "All",
    ...new Set(books.map((book) => book.category)),
  ];

  const adminBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
      book.author.toLowerCase().includes(adminSearch.toLowerCase());

    const matchesCategory =
      adminCategory === "All" ||
      book.category === adminCategory;

    return matchesSearch && matchesCategory;
  });

  const totalStock = books.reduce(
    (sum, book) => sum + Number(book.quantity || 0),
    0
  );

  const lowStock = books.filter(
    (book) => Number(book.quantity) > 0 && Number(book.quantity) <= 5
  ).length;

  return (
    <main className="admin-page">
      <div className="admin-header">
        <div>
          <span className="section-kicker">MANAGEMENT</span>
          <h1>Admin Dashboard</h1>
          <p>Manage your Bookora inventory and catalogue.</p>
        </div>

        <button
          className="primary-button"
          onClick={onStartAdd}
        >
          <Plus size={18} />
          Add New Book
        </button>
      </div>

      {usingDemoData && (
        <div className="demo-notice">
          Demo mode is active. Add your MongoDB connection to
          create, edit and delete real books.
        </div>
      )}

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div>
            <span>Total Books</span>
            <strong>{books.length}</strong>
          </div>

          <BookOpen size={26} />
        </div>

        <div className="admin-stat-card">
          <div>
            <span>Total Stock</span>
            <strong>{totalStock}</strong>
          </div>

          <Package size={26} />
        </div>

        <div className="admin-stat-card">
          <div>
            <span>Categories</span>
            <strong>{adminCategories.length - 1}</strong>
          </div>

          <Sparkles size={26} />
        </div>

        <div className="admin-stat-card warning-stat">
          <div>
            <span>Low Stock</span>
            <strong>{lowStock}</strong>
          </div>

          <Package size={26} />
        </div>
      </div>

      {lowStock > 0 && (
        <div className="stock-alert">
          <Package size={21} />

          <div>
            <strong>Stock Alert</strong>
            <p>
              {lowStock} book{lowStock > 1 ? "s are" : " is"} running
              low on inventory.
            </p>
          </div>
        </div>
      )}

      {showBookForm && (
        <form className="book-form" onSubmit={onSave}>
          <div className="form-header">
            <div>
              <span className="section-kicker">
                {editingBook ? "EDIT BOOK" : "NEW BOOK"}
              </span>

              <h2>
                {editingBook
                  ? "Update Book"
                  : "Add New Book"}
              </h2>
            </div>

            <button
              type="button"
              className="close-form-button"
              onClick={onCancelForm}
            >
              <X size={20} />
            </button>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Title</label>
              <input
                name="title"
                value={form.title}
                onChange={onFormChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Author</label>
              <input
                name="author"
                value={form.author}
                onChange={onFormChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                name="category"
                value={form.category}
                onChange={onFormChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={onFormChange}
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={onFormChange}
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input
                name="image"
                value={form.image}
                onChange={onFormChange}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onFormChange}
              rows="4"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onCancelForm}
            >
              Cancel
            </button>

            <button className="primary-button">
              <Check size={17} />
              {editingBook ? "Update Book" : "Add Book"}
            </button>
          </div>
        </form>
      )}

      <div className="admin-table-card">
        <div className="table-title">
          <div>
            <h2>Inventory</h2>
            <span>{adminBooks.length} books</span>
          </div>

          <div className="admin-actions">
            <div className="admin-search">
              <Search size={17} />

              <input
                value={adminSearch}
                onChange={(e) =>
                  setAdminSearch(e.target.value)
                }
                placeholder="Search inventory..."
              />
            </div>

            <select
              value={adminCategory}
              onChange={(e) =>
                setAdminCategory(e.target.value)
              }
            >
              {adminCategories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Author</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {adminBooks.map((book) => {
                const stock = Number(book.quantity || 0);

                return (
                  <tr key={book._id}>
                    <td>
                      <div className="table-book">
                        <div className="table-book-image">
                          {book.image ? (
                            <img
                              src={book.image}
                              alt={book.title}
                            />
                          ) : (
                            <BookOpen size={21} />
                          )}
                        </div>

                        <strong>{book.title}</strong>
                      </div>
                    </td>

                    <td>{book.author}</td>

                    <td>
                      <span className="table-category">
                        {book.category}
                      </span>
                    </td>

                    <td>₹{book.price}</td>

                    <td>{stock}</td>

                    <td>
                      <span
                        className={`status-badge ${
                          stock === 0
                            ? "out"
                            : stock <= 5
                            ? "low"
                            : "in"
                        }`}
                      >
                        {stock === 0
                          ? "Out of Stock"
                          : stock <= 5
                          ? "Low Stock"
                          : "In Stock"}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() => onStartEdit(book)}
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="delete-action"
                          onClick={() => onDelete(book._id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {adminBooks.length === 0 && (
            <div className="empty-table">
              <BookOpen size={34} />
              <p>No books found.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

/* ================= FOOTER ================= */

function Footer({ onHome }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <button className="brand" onClick={onHome}>
            <span className="brand-icon">
              <BookOpen size={21} />
            </span>

            <span>
              Book<span>ora</span>
            </span>
          </button>

          <p>
            Discover stories, ideas and knowledge worth
            remembering.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Explore</h4>
            <button onClick={onHome}>Home</button>
            <button onClick={onHome}>Books</button>
            <button onClick={onHome}>Categories</button>
          </div>

          <div>
            <h4>Bookora</h4>
            <button>About Us</button>
            <button>Contact</button>
            <button>Privacy</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Bookora. All rights reserved.</span>
        <span>Made with ❤️ for readers.</span>
      </div>
    </footer>
  );
}

export default App;