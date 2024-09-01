const sections = document.querySelectorAll('section')
const navLi = document.querySelectorAll('li')
const controls = document.querySelectorAll('.controls button')
const scrollable = document.querySelector('.testimonial-container')
const items = Array.from(document.querySelectorAll('.testimonial'))
const itemWidth = items[0].offsetWidth + 20
const inputs = document.querySelectorAll('input')
let maxIndex = 0
let currentIndex = 0

document.querySelectorAll('nav ul li a').forEach(anchor => {
	anchor.addEventListener('click', function(e) {
		e.preventDefault()
		pauseObserver()

		removeClassList()

		anchor.parentNode.classList.add('active')

		const targetId = this.getAttribute('href')
		const targetElement = document.querySelector(targetId)

		const header = document.querySelector('header')
		const headerHeight = header ? header.offsetHeight: 0

		const offsetTop = targetElement.offsetTop - headerHeight

		monitorScrollCompletion(offsetTop)

		window.scrollTo({
			top: offsetTop,
			behavior: 'smooth'
		})
	})
})


controls.forEach(btn => {
	const id = btn.getAttribute('id')

	btn.addEventListener('click', () => {
		if (id === 'left') {
			scrollLeft()
		} else {
			scrollRight()
		}
	})
})


const observer = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			setActiveMenu(entry.target.getAttribute('id'))
		}
	})
}, {
	root: null,
	rootMargin: '0px',
	threshold: .5
})

// Observar cada seção
sections.forEach(section => {
	observer.observe(section)
})

inputs.forEach(inp => {
	inp.addEventListener('focus',
		() => {
			inp.parentNode.querySelector('label').style.top = '-15px'
		})


	inp.addEventListener('blur',
		() => {
			if (inp.value.trim()) return

			inp.value = ''
			inp.parentNode.querySelector('label').style.top = '15px'
		})
})

function setActiveMenu(id) {
	removeClassList()
	document.querySelector(`li#li-${id}`).classList.add('active')
}


function removeClassList() {
	navLi.forEach(li => {
		li.classList.remove('active')
	})
}


function scrollLeft() {
	if (currentIndex > 0) {
		currentIndex--
		updateScrollPosition('left')
	}
}


function scrollRight() {
	if (currentIndex < maxIndex) {
		currentIndex++
		updateScrollPosition("right")
	}
}


function updateScrollPosition(dir) {
	const offset = itemWidth * currentIndex

	if (currentIndex == 0) {
		controls[0].style.display = 'none'
	} else if (currentIndex === maxIndex) {
		controls[1].style.display = 'none'
	} else {
		controls.forEach(btn => {
			btn.style.display = 'flex'
		})
	}

	scrollable.style.transform = `translateX(-${offset}px)`
}


function setMaxIndex() {
	const containerWidth = scrollable.offsetWidth
	const itemWidth = items[0].offsetWidth + 20
	const visibleItems = Math.floor(containerWidth / itemWidth)
	maxIndex = items.length - visibleItems
}


function checkScrollable() {
	const containerWidth = scrollable.offsetWidth
	const totalItemsWidth = items.reduce((total, item) => {
		return total + item.offsetWidth + 20 // 20px é a gap entre os items
	}, 0)

	if (totalItemsWidth <= containerWidth) {
		controls.forEach(btn => btn.style.display = 'none')

		currentIndex = 0
		scrollable.style.transform = 'translateX(0px)'
		scrollable.style.justifyContent = 'center'
	} else {
		setMaxIndex()

		scrollable.style.justifyContent = 'flex-start'

		controls.forEach(btn => {
			if (btn.id === 'right') btn.style.display = 'flex'
		})
	}
}


function pauseObserver() {
	isScrolling = true
	observer.disconnect()
}


// Função para reconectar o observador
function resumeObserver() {
	isScrolling = false
	sections.forEach(section => {
		observer.observe(section)
	})
}


function monitorScrollCompletion(scrollTarget) {
	const checkScrollPosition = () => {
		const scrollPosition = window.scrollY
		const documentHeight = document.documentElement.scrollHeight
		const viewportHeight = window.innerHeight

		if (scrollPosition >= documentHeight - viewportHeight - 10) {
			resumeObserver()
		} else if (Math.abs(scrollPosition - scrollTarget) < 10) {
			resumeObserver()
		} else if (isScrolling) {
			requestAnimationFrame(checkScrollPosition)
		}
	}

	checkScrollPosition()
}

window.addEventListener('resize', checkScrollable)
window.addEventListener('load', checkScrollable)