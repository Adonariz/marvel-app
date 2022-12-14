import { Component } from 'react';
import PropTypes from "prop-types";

import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

class CharList extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      charList: [],
      loading: true,
      error: false,
      newItemLoading: false,
      offset: 210,
      charEnded: false,
    }
  }
  
  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest();
  }

  onRequest = (offset) => {
    this.onCharListLoading();
    this.marvelService.getAllCharacters(offset)
                      .then(this.onCharListLoaded);
  }

  onCharListLoading = () => {
    this.setState({
      newItemLoading: true,
    })
  }

  onCharListLoaded = (newCharList) => {
    let ended = false;

    if (newCharList.length < 9) {
      ended = true;
    }

    this.setState(({offset, charList}) => ({
      charList: [...charList, ...newCharList],
      loading: false,
      newItemLoading: false,
      offset: offset += 9,
      charEnded: ended,
    }));

    console.log(this.state.charList);
  }

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  }

  itemRefs = [];

  setRef = (ref) => {
    this.itemRefs.push(ref);
  }

  focusOnItem = (id) => {
    this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
    this.itemRefs[id].classList.add('char__item_selected');
    this.itemRefs[id].focus();
  }

  renderItems = (arr) => {
    const items = arr.map((item, i) => {
      const {name, thumbnail} = item;

      const placeholderImgUrl = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';

      let imgStyle = {objectFit: thumbnail === placeholderImgUrl ? 'unset' : 'cover'};

      return (
        <li 
          key={item.id}
          tabIndex={0}
          ref={this.setRef} 
          className="char__item"
          onClick={() => {
            this.props.onCharSelect(item.id);
            this.focusOnItem(i);
          }}
          onKeyDown={(evt) => {
            if (evt.key === ' ' || evt.key === 'Enter') {
              this.props.onCharSelect(item.id);
              this.focusOnItem(i);
            }
          }}
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
    const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;
    const items = this.renderItems(charList);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null;
    
    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button 
            className="button button__main button__long"
            disabled={newItemLoading}
            style={{'display': charEnded ? 'none' : 'block'}}
            onClick={() => this.onRequest(offset)}>
            <div className="inner">load more</div>
        </button>
      </div>
    )
  }
}

CharList.propTypes = {
  onCharSelect: PropTypes.func.isRequired,
}

export default CharList;