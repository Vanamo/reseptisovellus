import React from 'react'
import { connect } from 'react-redux'
import { Button, Grid, Icon, Label, Segment, Table } from 'semantic-ui-react'
import NoteForm from './NoteForm'
import ChangeNoteForm from './ChangeNoteForm'
import EditRecipe from './EditRecipe'
import { newLike, deleteLike } from './../reducers/likeReducer'
import { newSuccessNotification } from './../reducers/notificationReducer'

class RecipeInfo extends React.Component {

  state = {
    showNoteForm: false,
    showChangeNoteForm: false,
    showEditRecipe: false,
  }

  showNoteForm = () => {
    this.setState({ showNoteForm: true })
  }

  showChangeNoteForm = () => {
    this.setState({ showChangeNoteForm: true })
  }

  showEditRecipe = () => {
    this.setState({ showEditRecipe: true })
  }

  handleLike = async () => {
    const likeObject = {
      recipeid: this.props.recipe.id
    }

    await this.props.newLike(likeObject)

    window.location.reload()
  }

  handleDislike = async () => {
    const like = this.props.likes.find(l => l.userid === this.props.user.id)
    console.log('like', like)
    await this.props.deleteLike(like)

    window.location.reload()
  }

  render() {
    const recipe = this.props.recipe
    const user = this.props.user
    const note = this.props.note

    if (!recipe) {
      return null
    }

    let noteToShow = null
    if (user.id &&
      !note &&
      !this.state.showNoteForm) {
      noteToShow = (
        <Button size='small' onClick={this.showNoteForm}>Lisää muistiinpano</Button>
      )
    } else if (note && !this.state.showChangeNoteForm) {
      noteToShow = (
        <div className='note'>
          <Segment compact>
            <h3>Muistiinpano</h3>
            {note.content}
            <div><Button size='tiny' onClick={this.showChangeNoteForm}>Muokkaa</Button></div>
          </Segment>
        </div>
      )
    }

    let instructions = null
    if (recipe.instructions) {
      instructions = (<div><h2>Valmistusohje</h2><p>{recipe.instructions}</p></div>)
    }

    let tags = null
    if (recipe.tags.length > 0) {
      tags = (<div>{recipe.tags.map(t => <Label key={t._id}>{t.name}</Label>)}</div>)
    }

    let edit = null
    if (user.id === recipe.user._id) {
      edit = (<Button onClick={this.showEditRecipe} color='black'>Muokkaa reseptiä</Button>)
    }

    let like = null
    if (user.id && user.id !== recipe.user._id) {
      console.log('likes', this.props.likes)
      if (!recipe.likedUsers.find(l => l === user.id)) {
        like =
          <div>
            <Button as='div' labelPosition='right'>
              <Button onClick={this.handleLike}>
                <Icon name='heart' />
              </Button>
              <Label as='a' basic color='red' pointing='left'>{this.props.likes.length}</Label>
            </Button>
          </div>
      } else {
        like =
          <div>
            <Button as='div' labelPosition='right'>
              <Button onClick={this.handleDislike} color='red'>
                <Icon name='heart' />
              </Button>
              <Label as='a' basic color='red' pointing='left'>{this.props.likes.length}</Label>
            </Button>
          </div>
      }
    }

    if (this.state.showEditRecipe) {
      return <EditRecipe
        recipe={recipe}
        note={note}
        user={user} />
    }

    return (
      <Grid className='recipe'>
        <Grid.Column width={6}>
          <h1>{recipe.title}</h1>
          <h2>Ainekset</h2>
          <Table compact basic='very' celled collapsing id='ingredients'>
            <Table.Body>
              {recipe.ingredients.map(i =>
                <Table.Row key={i.id}>
                  <Table.Cell>
                    {i.quantity}
                  </Table.Cell>
                  <Table.Cell>
                    {i.unit.name}
                  </Table.Cell>
                  <Table.Cell>
                    {i.name.name}
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
          {instructions}
          {tags}
          {edit}
          {like}
          {noteToShow}
          {this.state.showNoteForm && <NoteForm recipe={recipe} />}
          {this.state.showChangeNoteForm && <ChangeNoteForm note={note} />}
        </Grid.Column>
      </Grid>
    )
  }
}

export default connect(
  null,
  { newLike, deleteLike, newSuccessNotification }
)(RecipeInfo)