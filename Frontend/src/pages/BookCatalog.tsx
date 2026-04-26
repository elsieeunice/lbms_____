import axios from 'axios'
import { ArrowRight01Icon, Layout01Icon, Search01Icon } from 'hugeicons-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

const popularIsbns = ['9780857197689', '9781847941831','9781612680019', '9780062457714', '1929194013']

type OpenLibraryIsbnResponse = {
  title?: string
  publish_date?: string
  number_of_pages?: number
  publishers?: string[]
  authors?: Array<{ key: string }>
}

type OpenLibraryAuthorResponse = {
  name?: string
}

type PopularBook = {
  isbn: string
  title: string
  authors: string[]
  publishDate: string | null
  pages: number | null
  publishers: string[]
  coverUrl: string | null
}

type BookCategory = {
  name: string
  title: string
  coverUrl: string
}

type OpenLibrarySearchDoc = {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
}

type OpenLibrarySearchResponse = {
  docs: OpenLibrarySearchDoc[]
}

const BookCatalog = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [params, setParams] = useSearchParams()
  const [popular, setPopular] = useState<PopularBook[]>([])
  const [loadingPopular, setLoadingPopular] = useState(false)
  const urlQuery = params.get('q') ?? ''
  const [searchQuery, setSearchQuery] = useState(urlQuery)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<OpenLibrarySearchDoc[]>([])

  const isSearchRoute = location.pathname.startsWith('/books/search')
  const trimmedQuery = useMemo(() => searchQuery.trim(), [searchQuery])
  const isSearching = isSearchRoute || Boolean(trimmedQuery)

  const bookCategories: BookCategory[] = [
    {
      name: 'history',
      title: 'History',
      coverUrl:
      'https://www.publishersweekly.com/cover/9780393059748',
    },
    {
      name: 'self-improvement',
      title: 'Self-Improvement',
      coverUrl:
      'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1620206225i/39330937.jpg',
    },
    {
      name: 'money-investing',
      title: 'Money / Investing',
      coverUrl:
        'https://lh3.googleusercontent.com/boyMq552w0yHYxxLiMbSD6rl-F88lqabf8w_rArtRiw-nMQPmmeWnIEcR8aa3FsEZR7XiIg7YI2IdKxR6Qs3q_D9QdiK7ffFVVZrlyvalCsn1Nu7',
    },
    {
      name: 'business',
      title: 'Business',
      coverUrl:
      'https://hbr.org/resources/images/products/11323_500.png',
    },
    {
      name: 'romance',
      title: 'Romance',
      coverUrl:
      'https://covers.openlibrary.org/b/id/540723-M.jpg',
    },
    {
      name: 'kids',
      title: 'Kids',
      coverUrl:
        'https://covers.openlibrary.org/b/id/426382-M.jpg',
    },
  ]
  
  useEffect(() => {
    let cancelled = false
    
    const fetchPopular = async () => {
      try {
        setLoadingPopular(true)
        const results = await Promise.all(
          popularIsbns.map(async (isbn) => {
            try {
              const { data } = await axios.get<OpenLibraryIsbnResponse>(
                `https://openlibrary.org/isbn/${isbn}.json`,
              )

              const authorNames = await Promise.all(
                (data.authors ?? []).map(async (a) => {
                  try {
                    const { data: author } = await axios.get<OpenLibraryAuthorResponse>(
                      `https://openlibrary.org${a.key}.json`,
                    )
                    return author.name ?? null
                  } catch {
                    return null
                  }
                }),
              )

              return {
                isbn,
                title: data.title ?? 'Untitled',
                authors: authorNames.filter((n): n is string => Boolean(n)),
                publishDate: data.publish_date ?? null,
                pages: data.number_of_pages ?? null,
                publishers: data.publishers ?? [],
                coverUrl: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
              } satisfies PopularBook
            } catch {
              return {
                isbn,
                title: 'Untitled',
                authors: [],
                publishDate: null,
                pages: null,
                publishers: [],
                coverUrl: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
              } satisfies PopularBook
            }
          }),
        )

        if (!cancelled) {
          setPopular(results)
        }
      } catch {
        if (!cancelled) {
          setPopular([])
        }
      } finally {
        if (!cancelled) {
          setLoadingPopular(false)
        }
      }
    }

    fetchPopular()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setSearchQuery(urlQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQuery])

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      if (!isSearchRoute || !trimmedQuery) {
        setSearchResults([])
        return
      }

      try {
        setSearchLoading(true)
        const { data } = await axios.get<OpenLibrarySearchResponse>(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(trimmedQuery)}&limit=24`,
        )
        if (!cancelled) setSearchResults(data.docs ?? [])
      } catch {
        if (!cancelled) setSearchResults([])
      } finally {
        if (!cancelled) setSearchLoading(false)
      }
    }

    const t = setTimeout(run, 300)

    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [isSearchRoute, trimmedQuery])

  const updateSearch = (nextValue: string) => {
    setSearchQuery(nextValue)
    const nextTrimmed = nextValue.trim()

    if (!nextTrimmed) {
      const nextParams = new URLSearchParams(params)
      nextParams.delete('q')
      setParams(nextParams, { replace: true })
      navigate('/books', { replace: true })
      return
    }

    const nextParams = new URLSearchParams(params)
    nextParams.set('q', nextTrimmed)
    setParams(nextParams, { replace: true })
    if (!isSearchRoute) navigate(`/books/search?q=${encodeURIComponent(nextTrimmed)}`, { replace: true })
  }

  return (
    <div className="">
      <div className="bg-yellow-100 rounded-bl-[90px] w-full relative px-7 p-3 h-[53vh]">
        <h1 className="text-3xl font-bold my-4">Discover</h1>
        <div className="flex items-center bg-white w-[534px] px-1 rounded-lg">
          <select name="category" id="category" className="h-full py-4 px-1 outline-none border-r border-gray-100">
            <option value="all">All Categories</option>
            <option value="fiction">Fiction</option>
            <option value="non-fiction">Non-Fiction</option>
            <option value="science">Science</option>
            <option value="history">History</option>
          </select>
          
          <div className="flex items-center px-4 h-full">
            <Search01Icon/>
            <input 
              type="text" 
              placeholder="Search books..." 
              value={searchQuery}
              onChange={(e) => updateSearch(e.target.value)}
              onFocus={() => {
                if (!isSearchRoute) navigate('/books/search', { replace: true })
              }}
              className="p-4 outline-none" 
            />
            <button
              type="button"
              onClick={() => {
                const q = searchQuery.trim()
                navigate(q ? `/books/search?q=${encodeURIComponent(q)}` : '/books/search')
              }}
              className="bg-black p-3 text-sm text-white rounded-xl font-light w-[110px]"
            >
              Search
            </button>
          </div> 
        </div>
        
        <div>
          <div className="mt-10 flex justify-between items-center">
            <h1 className="text-lg font-medium">Book Recommendations</h1>
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg cursor-pointer">
              <p>View all</p>
              <ArrowRight01Icon />
            </div>
          </div>
        </div>
        
        <div className="mt-5">
          {isSearching ? (
            <div className="bg-white/70 border border-black/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {trimmedQuery ? `Results for "${trimmedQuery}"` : 'Start typing to search'}
                </p>
                <button
                  type="button"
                  className="text-sm text-gray-700 hover:text-gray-900"
                  onClick={() => updateSearch('')}
                >
                  Clear
                </button>
              </div>

              <div className="mt-4">
                {searchLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <div key={idx} className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 flex gap-4">
                        <div className="w-16 h-24 bg-gray-200 rounded" />
                        <div className="flex-1">
                          <div className="h-4 w-3/4 bg-gray-200 rounded" />
                          <div className="mt-2 h-3 w-1/2 bg-gray-200 rounded" />
                          <div className="mt-4 h-3 w-1/3 bg-gray-200 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : trimmedQuery ? (
                  searchResults.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.map((doc) => {
                        const coverUrl = doc.cover_i
                          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
                          : null

                        return (
                          <div key={doc.key} className="rounded-xl border border-gray-200 bg-white p-4 flex gap-4">
                            <div className="w-16 h-24 bg-gray-100 rounded overflow-hidden shrink-0">
                              {coverUrl ? (
                                <LazyLoadImage
                                  src={coverUrl}
                                  alt={doc.title}
                                  className="w-full h-full object-cover"
                                  effect="blur"
                                />
                              ) : null}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 line-clamp-2">{doc.title}</p>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                                {(doc.author_name ?? []).slice(0, 2).join(', ') || 'Unknown author'}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {doc.first_publish_year ? `First published ${doc.first_publish_year}` : 'Year unknown'}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">No results found.</div>
                  )
                ) : (
                  <div className="text-sm text-gray-600">Start typing to search.</div>
                )}
              </div>
            </div>
          ) : loadingPopular ? (
            <div className="flex gap-8 overflow-x-auto pb-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="w-48 shrink-0 animate-pulse">
                  <div className="w-50 h-[260px] overflow-hidden bg-white border border-black/10">
                    <div className="h-full w-full bg-gray-200" />
                  </div>
                  <div className="mt-2 h-4 w-40 bg-gray-200 rounded" />
                  <div className="mt-2 h-3 w-28 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-8 overflow-x-auto pb-2">
              {popular.map((book) => (
                <div key={book.isbn} className="w-48 shrink-0">
                  <div className="w-50 h-[260px] overflow-hidden bg-white border border-black/10">
                    {book.coverUrl ? (
                      <LazyLoadImage
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        effect="blur"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">
                        No cover
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-900 line-clamp-2">{book.title}</p>
                  {book.authors.length > 0 && (
                    <p className="text-xs text-gray-600 line-clamp-1">{book.authors.join(', ')}</p>
                  )}
                  {/* <div className="mt-1 text-xs text-gray-500 space-y-0.5">
                    {book.publishDate && <p>Published: {book.publishDate}</p>}
                    {book.pages && <p>Pages: {book.pages}</p>}
                    {book.publishers.length > 0 && <p className="line-clamp-1">{book.publishers.join(', ')}</p>}
                    <p>ISBN: {book.isbn}</p>
                  </div> */}
                </div>
              ))}
            </div>
          )}

          {!isSearching && (
            <>
              <div className='py-10'>
            <div className='flex justify-between items-center mb-20'>
              <p className="text-lg font-medium mb-4">Book Categories</p>
              <div className='bg-gray-100 rounded-xl p-2'>
                <Layout01Icon size={17}/>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {bookCategories.map((category) => (
                <Link
                  key={category.name}
                  to="/books"
                  className="relative block w-40 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
                  aria-label={`Browse ${category.title}`}
                >
                  <LazyLoadImage
                    src={category.coverUrl}
                    alt={category.title}
                    effect="blur"
                    wrapperClassName="absolute bottom-9 right-[-40px] -translate-x-1/2 w-20 "
                    className="w-full h-full object-contain"
                  />
                  <div className="bg-gray-200 h-[70px] w-full rounded-t-xl" />
                  <div className="bg-white py-2">
                    <p className="text-center block text-sm font-light px-2 line-clamp-1">
                      {category.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="pb-10">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-medium">Most Popular</h1>
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg cursor-pointer">
                <p>View all</p>
                <ArrowRight01Icon />
              </div>
            </div>

            <div className="mt-5">
              {loadingPopular ? (
                <div className="flex gap-8 overflow-x-auto pb-2">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="w-48 shrink-0 animate-pulse">
                      <div className="w-50 h-[260px] overflow-hidden bg-white border border-black/10">
                        <div className="h-full w-full bg-gray-200" />
                      </div>
                      <div className="mt-2 h-4 w-40 bg-gray-200 rounded" />
                      <div className="mt-2 h-3 w-28 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex gap-8 overflow-x-auto pb-2">
                  {popular.map((book) => (
                    <div key={book.isbn} className="w-48 shrink-0">
                      <div className="w-50 h-[260px] overflow-hidden bg-white border border-black/10">
                        {book.coverUrl ? (
                          <LazyLoadImage
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-full h-full object-cover"
                            effect="blur"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">
                            No cover
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-sm font-medium text-gray-900 line-clamp-2">{book.title}</p>
                      {book.authors.length > 0 && (
                        <p className="text-xs text-gray-600 line-clamp-1">{book.authors.join(', ')}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

            </>
          )}

        </div>

      </div>
    </div>
  )
}

export default BookCatalog
