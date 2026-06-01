"use client"
import { useEffect, useState, useMemo } from 'react'

// 书籍类型定义
interface Book {
	id: string,
	name: string,
	tags: string[]
	// ... 其他属性
}

// 模拟接口：获取所有书籍
async function fetchAllBooks() {
const list: Book[] = Array.from({ length: 100000 }, (_, index) => ({
  id: `${index + 1}`,
  name: `书籍${index + 1}`,
  tags: [`tag${index % 100}`, `category${(index % 5) + 1}`, `type${(index % 3) + 1}`]
}));
	return list
}

export default function MyPage() {
	const [books, setBooks] = useState<Book[]>()
	useEffect(() => {
		// get all the books
		const fetchData = async () => {
			const allBooks = await fetchAllBooks()
			setBooks(allBooks)
		}
		fetchData()
	}, []) // to do

	const [page, setPage] = useState(1)
	const [perPage, setPerPage] = useState(10)
	const [keyword, setKeyword] = useState('')
	const [tagFilters, setTagFilters] = useState<string[]>([])
	useEffect(() => {
		setPage(1)
	}, [keyword, tagFilters]) // to do


	const filterBooks = useMemo(()=>{
		if (!books || books.length ===0) return []
		return books.filter(book =>{
			const keywordMatch = keyword.trim() === '' ? true : book.name.toLowerCase().includes(keyword.toLowerCase())
			const tagMatch = tagFilters.length === 0 ? true : tagFilters.every(tag => book.tags.includes(tag))
			return keywordMatch && tagMatch
		})}, [books, keyword, tagFilters])


	const shownItems: Book[] = useMemo(() => {
		if (!books || books.length ===0 || filterBooks.length === 0) return []

		const start = (page -1) * perPage
		const end = start + perPage

		return filterBooks.slice(100, 110)
	}, [filterBooks, page]) // to do

	// 渲染 UI
	return (
		<div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
			<h1>书籍列表</h1>

			{/* 搜索框 */}
			<div style={{ margin: '16px 0' }}>
				<input
					type="text"
					placeholder="搜索书籍名称..."
					value={keyword}
					onChange={(e) => {
						setKeyword(e.target.value)
						setPage(1) // 搜索时重置页码
					}}
					style={{ padding: '8px', width: '300px' }}
				/>
			</div>


			{/* 筛选结果统计 */}
			<div style={{ margin: '16px 0' }}>
				共 {shownItems.length} 本匹配的书籍
			</div>

			{/* 书籍列表 */}
			<ul style={{ listStyle: 'none', padding: 0 }}>
				{shownItems.map(book => (
					<li
						key={book.id}
						style={{ padding: '12px', border: '1px solid #eee', marginBottom: '8px', borderRadius: '4px' }}
					>
						<h3>{book.name}</h3>
						<p>标签：{book.tags.join(', ')}</p>
					</li>
				))}
			</ul>

			{/* 极简分页 */}
			<div style={{ marginTop: '20px' }}>
				<button
					disabled={page === 1}
					onClick={() => setPage(prev => prev - 1)}
					style={{ marginRight: '8px' }}
				>
					上一页
				</button>
				<span>第 {page} 页</span>
				<button
					disabled={shownItems.length === 0}
					onClick={() => setPage(prev => prev + 1)}
					style={{ marginLeft: '8px' }}
				>
					下一页
				</button>
			</div>
		</div>
	)
}
