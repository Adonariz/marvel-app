import './charList.scss';
import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

class CharList extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      charList: [],
      loading: true,
      error: false,
    }
  }
  
  marvelService = new MarvelService();

  componentDidMount() {
    this.marvelService.getAllCharacters()
        .then(this.onCharListLoaded);
  }

  onCharListLoaded = (charList) => {
    this.setState({
      charList,
      loading: false,
    });

    console.log(this.state.charList);
  }

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  }

  renderItems = (arr) => {
    const items = arr.map(item => {
      const {name, thumbnail} = item;

      const placeholderImgUrl = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';

      let imgStyle = {objectFit: thumbnail === placeholderImgUrl ? 'unset' : 'cover'};

      return (
        <li 
          key={item.id} 
          className="char__item"
          onClick={() => this.props.onCharSelect(item.id)}
        >
          <img src={thumbnail} alt={name} style={imgStyle}/>
          <div className="char__name">{name}</div>
        </li>
      );
    });

    return (
      <ul className="char__grid">
        {items}
      </ul>
    );
  }

  render() {
    const {charList, loading, error} = this.state;
    const items = this.renderItems(charList);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null;
    
    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button className="button button__main button__long">
            <div className="inner">load more</div>
        </button>
      </div>
    )
  }
}

export default CharList;