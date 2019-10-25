let app = new Vue({
  el: '#app',
  data: {
    bookNumber: '',
    chapterNumber: '',
    chapterTracker: '',
    initial: 0,
    maxBook: '',
    maxChapter: [],
    current: {
      reference: '',
      chapter: '',
      verses: {}
    },
    loading: true,
    searchBook: '',
    addedName: '',
    addedComment: '',
    addedTime: moment().format('MMMM Do YYYY, h:mm a'),
    comments: {}
  },
  created() {
    this.startCount();
    this.bom();
  },
  computed: {

  },
  watch: {

  },
  methods: {
    startCount() {
      this.bookNumber = this.initial;
      this.chapterNumber = this.initial;
      this.chapterTracker = this.chapterExpansion();
    },
    chapterExpansion() {
      this.chapterTracker = this.initial;
      for(let i = 0; i <= this.bookNumber; i++) {
        if (i < this.bookNumber) {
          this.chapterTracker += this.maxChapter[i], 10;
        }
        else {
          this.chapterTracker += this.chapterNumber, 10 + 1;
        }
      }
      return this.chapterTracker;
    },
    async bom() {
      try {
        this.loading = true;
        const response = await axios.get('https://raw.githubusercontent.com/bcbooks/scriptures-json/master/book-of-mormon.json');
        this.current = response.data.books[this.bookNumber].chapters[this.chapterNumber];
        this.loading = false;
        this.maxChaps(response.data.books);
        this.maxBook = response.data.books.length - 1;
        this.bookTitle = response.data.books[this.bookNumber].book;
        this.pieceTitle = response.data.title;
        this.chapterTracker = this.chapterExpansion();
        this.chapterNumber;
      } catch (error) {
        console.log(error);
      }
    },
    maxChaps(response) {
      for (let i = 0; i < response.length; i++) {
        this.maxChapter[i] = response[i].chapters.length;
      }
      return;
    },
    previousBook() {
      this.bookNumber = this.bookNumber - 1;
      this.chapterNumber = 0;
      if (this.bookNumber < 0)
        this.bookNumber = 0;
      this.bom();
    },
    previousChapter() {
      this.chapterNumber = this.chapterNumber - 1;
      if ((this.chapterNumber < 0) && (this.bookNumber > 0)) {
        this.bookNumber = this.bookNumber - 1;
        this.chapterNumber = this.maxChapter[this.bookNumber] - 1;
      }
      this.bom()
    },
    getRandom(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum and minimum are inclusive
    },
    nextChapter() {
      this.chapterNumber = this.chapterNumber + 1;
      if (this.chapterNumber > this.maxChapter[this.bookNumber] - 1) {
        this.chapterNumber = this.initial;
        this.bookNumber += this.bookNumber + 1;
      }
      this.bom()
    },
    nextBook() {
      this.bookNumber = this.bookNumber + 1;
      this.chapterNumber = 0;
      if (this.bookNumber > this.maxBook) {
        this.bookNumber = this.maxBook;
      }
      this.bom();
    },
    addComment() {
      if (!(this.chapterTracker in this.comments))
        Vue.set(app.comments, this.chapterTracker, new Array);
      this.addedTime = moment().format('MMMM Do YYYY, h:mm a');
      this.comments[this.chapterTracker].push({
        author: this.addedName,
        text: this.addedComment,
        time: this.addedTime
      });
      this.addedName = '';
      this.addedComment = '';
    },
  }
});