import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPokemonById, deletePokemon, resetDeletedPokemon, modifyPokemon, resetModifyPokemon, getPokemonTypes } from '../../redux/actions';
import '../DetailPage/DetailPage.css'

class DetailPage extends Component {
  state = {
    name: '',
    image: '',
    hp: '',
    attack: '',
    defense: '',
    speed: '',
    height: '',
    weight: '',
    type1: '',
    type2: '',
    selectedType1: '',
    selectedType2: '',
    isDeleteMessageVisible: false,
    isModifyMessageVisible: false,
    isModalOpen: false,
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getPokemonById(id);
    this.props.getPokemonTypes();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.deletedPokemon !== this.props.deletedPokemon && this.props.deletedPokemon) {
      this.showDeleteMessage();
    }

    if (prevProps.modifyPokemon !== this.props.modifyPokemon && this.props.modifyPokemon) {
      this.showModifyMessage();
    }
  }

  handleDelete = () => {
    const { id } = this.props.match.params;
    this.props.deletePokemon(id);
  };

  handleModify = () => {
    const { id } = this.props.match.params;
    const { name, hp, attack, defense, speed, height, weight, selectedType1, selectedType2 } = this.state;
  
    const modifiedData = {};
    
    const nombre = name.toLowerCase()
    if (name) {
      modifiedData.name = nombre.trim();
    }
    if (hp) {
      modifiedData.hp = parseInt(hp);
    }
    if (attack) {
      modifiedData.attack = parseInt(attack);
    }
    if (defense) {
      modifiedData.defense = parseInt(defense);
    }
    if (speed) {
      modifiedData.speed = parseInt(speed);
    }
    if (height) {
      modifiedData.height = parseInt(height);
    }
    if (weight) {
      modifiedData.weight = parseInt(weight);
    }
    if (selectedType1 || selectedType2) {
      modifiedData.types = [];
      if (selectedType1) {
        modifiedData.types.push(selectedType1);
      }
      if (selectedType2) {
        modifiedData.types.push(selectedType2);
      }
    }
  
    this.props.modifyPokemon(id, modifiedData);
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleType1Change = (e) => {
    this.setState({ selectedType1: e.target.value });
  };
  
  handleType2Change = (e) => {
    this.setState({ selectedType2: e.target.value });
  };

  handleGoBack = () => {
    this.props.history.push('/home');
  };

  handleOpenModal = () => {
    this.setState({ isModalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ isModalOpen: false });
  };

  showDeleteMessage = () => {
    this.setState({ isDeleteMessageVisible: true }, () => {
      setTimeout(() => {
        this.setState({ isDeleteMessageVisible: false });
        this.props.resetDeletedPokemon();
        this.props.history.push('/home');
      }, 1000);
    });
  };

  showModifyMessage = () => {
    this.setState({ isModifyMessageVisible: true }, () => {
      setTimeout(() => {
        this.setState({ isModifyMessageVisible: false });
        this.props.resetModifyPokemon();
        this.props.history.push('/home');
      }, 1000);
    });
  };

  render() {
    const { pokemon, pokemonTypes } = this.props;

    if (!pokemon) {
      return <div>Loading...</div>;
    }

    let apiPokemon, bdPokemon;

    if (Array.isArray(pokemon)) {
      apiPokemon = pokemon.find((p) => p.origen === 'API');
      bdPokemon = pokemon.find((p) => p.origen === 'BD');
    } else {
      apiPokemon = pokemon.origen === 'API' ? pokemon : null;
      bdPokemon = pokemon.origen === 'BD' ? pokemon : null;
    }

    const { isDeleteMessageVisible, isModifyMessageVisible, isModalOpen } = this.state;

    return (
  <div className="principal-detail-container">
 
  <button className="comeback-button" onClick={this.handleGoBack}>
        X
  </button>
  
  <div className="detail-allitems-container"> 
    {apiPokemon && (
      <div className="detail-item-container">
        <div className="detail-image-item-container">
            <img src={apiPokemon.image} alt={apiPokemon.name} />
            <div className="detail-name">{apiPokemon.name}</div>
        </div>
        <div className="detail-stats">
          <div className="stat-item">
            <strong>id:</strong> {apiPokemon.id}
          </div>
          {apiPokemon.stats.map((stat) => (
            <div className="stat-item" key={stat.name}>
              <strong>{stat.name}:</strong> {stat.value}
            </div>
          ))}
          <div className="stat-item">
            <strong>Types:</strong> {apiPokemon.types.join(", ")}
          </div>
          <div className="stat-item">
            <strong>Origen:</strong> {apiPokemon.origen}
          </div>
        </div>
      </div>
    )}

    {bdPokemon && (
      <div className="detail-item-container">
        {bdPokemon.image && (
            <div className="detail-image-item-container">
              <img src={bdPokemon.image} alt={bdPokemon.name} />
              <div className="detail-name">{bdPokemon.name}</div>
            </div>
        )}
        <div className="detail-stats">
          <div className="stat-item">
            <strong>id:</strong> {bdPokemon.id}
          </div>
          {bdPokemon.hp && (
            <div className="stat-item">
              <strong>hp:</strong> {bdPokemon.hp}
            </div>
          )}
          {bdPokemon.attack && (
            <div className="stat-item">
              <strong>attack:</strong> {bdPokemon.attack}
            </div>
          )}
          {bdPokemon.defense && (
            <div className="stat-item" >
              <strong>defense:</strong> {bdPokemon.defense}
            </div>
          )}
          {bdPokemon.speed && (
            <div className="stat-item">
              <strong>speed:</strong> {bdPokemon.speed}
            </div>
          )}
          {bdPokemon.height && (
            <div className="stat-item">
              <strong>height:</strong> {bdPokemon.height}
            </div>
          )}
          {bdPokemon.weight && (
            <div className="stat-item">
              <strong>weight:</strong> {bdPokemon.weight}
            </div>
          )}
          {bdPokemon.types && (
            <div className="stat-item">
              <strong>Types:</strong> {bdPokemon.types.join(", ")}
            </div>
          )}
          <div className="stat-item">
            <strong>Origen:</strong> {bdPokemon.origen}
          </div>
          <button onClick={this.handleOpenModal}>Modificar</button>
        </div >
        
      </div>
    )}
  </div>

  {isDeleteMessageVisible && <div>Eliminado con éxito</div>}
  {isModifyMessageVisible && <div>Pokemon modificado con éxito</div>}

  {/* Modal para modificar */}
  {bdPokemon && (
  <>
    {isModalOpen && (
      <div className="modal-container">
        <form className="modal-form" onSubmit={this.handleModify}>
          <label className="modal-label">
            Nombre:
          </label>
            <input
              className="modal-input"
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.handleInputChange}
            />

          <br />
          <label className="modal-label">
            URL de la imagen:
          </label>
            <input
              className="modal-input"
              type="text"
              name="image"
              value={this.state.image}
              onChange={this.handleInputChange}
            />
          
          <br />
          <label className="modal-label">
            HP:
          </label>

          <input
              className="modal-input"
              type="number"
              name="hp"
              value={this.state.hp}
              onChange={this.handleInputChange}
          />
         
          <br />
          <label className="modal-label">
            Ataque:
          </label>
            <input
              className="modal-input"
              type="number"
              name="attack"
              value={this.state.attack}
              onChange={this.handleInputChange}
            />
          
          <br />
          <label className="modal-label">
            Defensa:
            </label>
            <input
              className="modal-input"
              type="number"
              name="defense"
              value={this.state.defense}
              onChange={this.handleInputChange}
            />
          
          <br />
          <label className="modal-label">
            Velocidad:
          </label>
            <input
              className="modal-input"
              type="number"
              name="speed"
              value={this.state.speed}
              onChange={this.handleInputChange}
            />

          <br />
          <label className="modal-label">
            Altura:
            </label>
            <input
              className="modal-input"
              type="number"
              name="height"
              value={this.state.height}
              onChange={this.handleInputChange}
            />
 
          <br />
          <label className="modal-label">
            Peso:
          </label>
            <input
              className="modal-input"
              type="number"
              name="weight"
              value={this.state.weight}
              onChange={this.handleInputChange}
            />
          <br />
          <label className="modal-label">
            Tipo 1:
            </label>
            <select
              className="modal-select"
              value={this.state.selectedType1}
              onChange={this.handleType1Change}
            >
              <option value="">Seleccionar tipo</option>
              {pokemonTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

          <br />
          <label className="modal-label">
            Tipo 2:
          </label>
            <select
              className="modal-select"
              value={this.state.selectedType2}
              onChange={this.handleType2Change}
            >
              <option value="">Seleccionar tipo</option>
              {pokemonTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          <br />
          <button className="modal-button" type="submit">Modificar</button>
          <button className="modal-button" type="button" onClick={this.handleCloseModal}>
            Cancelar
          </button>
        </form>
      </div>
    )}
  </>
)}
</div>

    );
  }
}

const mapStateToProps = (state) => ({
  pokemon: state.pokemonByID,
  pokemonTypes: state.pokemonTypes,
  deletedPokemon: state.deletedPokemon,
  modifyPokemon: state.modifyPokemon,
});

const mapDispatchToProps = {
  getPokemonById,
  deletePokemon,
  resetDeletedPokemon,
  modifyPokemon,
  resetModifyPokemon,
  getPokemonTypes,
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailPage);
