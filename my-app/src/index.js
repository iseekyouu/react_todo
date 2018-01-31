/**
 * Created by anatoly on 28.01.18.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl,
    Checkbox, Button, ButtonGroup, ListGroup, ListGroupItem} from 'react-bootstrap';
//http://theory.phphtml.net

class TodoForm extends React.Component{
   /*constructor(props){
        super(props);
        this.state = this.props.list;
    }*/
    handleChange(name){
        return(
            (event) =>
                this.props.onChange(this.props.index, name, event)
        )
    }



    renderFormTextInput(key){
        return(
            <FormControl
                type='text'
                value={this.props.list[key]}
                onChange={
                    this.handleChange(key)
                }
            />
        );
    }

    renderFormTextarea(key){
        return(
                <FormControl
                    componentClass="textarea"
                    value={this.props.list[key]}
                    onChange={
                        this.handleChange(key)
                    }
                />
        );
    }

    renderFormSelect(key){
        return(
            <FormControl
                  componentClass="select"
                  value={this.props.list[key]}
                  onChange={
                      this.handleChange(key)
                  }
              >
              <option value="0">low</option>
              <option value="1">mid</option>
              <option value="2">high</option>
            </FormControl>
        );
    }

    renderFormDateInput(key){
        return(
            <FormControl
                type="date"
                value={this.props.list[key]}
                onChange={
                    this.handleChange(key)
                }
            />
        );
    }

    renderFormCheckBox(key){
      return (
          <Checkbox
              checked={this.props.list[key]}
              onChange={
                    this.handleChange(key)
                }
          />
      )
    }

    renderFormElement(element){
        const types = {
            input: this.renderFormTextInput,
            textarea: this.renderFormTextarea,
            select: this.renderFormSelect,
            date: this.renderFormDateInput,
            checkbox: this.renderFormCheckBox
        };

        if (!types[element.type]) return null
        const handle = types[element.type].bind(this, element.key)();

        const label = element.nolabel ? null : [element].map((el) => {
            return (<ControlLabel key={el.name}>{el.name}</ControlLabel>)
          }
        )

        return (
            <FormGroup>
                {label}
                {handle}
            </FormGroup>
        )
    }

    render(){
        if (!this.props.list) return null

        return(
            <Grid>
              <Row>
                <Col xs={6} md={6}>
                  <form>
                      {this.renderFormElement({key: 'name', name: 'Название', type: 'input'})}
                      {this.renderFormElement({key: 'descr', name: 'Описание', type: 'textarea'})}
                      {this.renderFormElement({key: 'priority', name: 'Приоритет', type: 'select'})}
                      {this.renderFormElement({key: 'deadline', name: 'Срок выполнения', type: 'date'})}
                      {this.renderFormElement({key: 'enddate', name: 'Дата завершения', type: 'date'})}
                      {this.renderFormElement({key: 'done', name: 'Выполнено', type: 'checkbox'})}
                  </form>
                </Col>
              </Row>
            </Grid>
        )
    }
}
class Filters extends React.Component{
  render(){
    return (
        <Grid>
          <Row>
            <Col xs={8} md={8}>
              <ButtonGroup>
                <Button>All</Button>
                <Button>Low</Button>
                <Button>Mid</Button>
                <Button>High</Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Grid>

    )
  }
}

class Game extends React.Component {
    constructor(){
        super();
        this.state = {
            list: [
                {
                    name: 'hello',
                    descr: 'description',
                    priority: 1,
                    deadline:'2018-01-19',
                    enddate: formatDate(new Date()),
                    done: 0
                }

            ],
            currentIndex: 0,
            hideForm: 0
        }
    }

    getPriorityName(priority){
       switch (priority){
        case 0:
          return 'low';
        case 1:
          return 'mid'
        case 2:
          return 'high'
        default:
          return 'low'
      }
    }

    render() {
        console.log('list render', this, this.state.list, this.state.currentIndex)
        //const game = this;
        const list = this.state.list.map((item, index) => {
            const active = index == this.state.currentIndex ?
                'active': '';
            const done = item.done ? 'done' : ''
            const className = `${active} ${done}`;
            const priorityName = this.getPriorityName(item.priority)
            return (
              <li
                key={index}
                className ={className}
                onClick={this.setCurrentIndex.bind(this, index)}
              >
                <dl className="dl-horizontal">
                  <dt>Название</dt>
                  <dd>{item.name}</dd>
                  <dt>Описание</dt>
                  <dd>{item.descr}</dd>
                  <dt>Приоритет</dt>
                  <dd>{priorityName}</dd>
                  <dt>Срок выполнения</dt>
                  <dd>{item.deadline}</dd>
                  <dt>Дата завершения</dt>
                  <dd>{item.enddate}</dd>
                  <dt>Удалить</dt>
                  <dd>
                    <Button bsStyle="danger"
                            onClick={(event) => this.handleRemove(this.state.currentIndex, event)}
                    >
                      Remove current
                    </Button>
                  </dd>
                </dl>
            </li>);
        });

        const index = this.state.currentIndex;
        return (
            <div className="todo">
                <div className="todo-board">
                    <Grid>
                      <Row>
                        <Col xs={8} md={8}>
                          <Button bsStyle="success"
                              onClick={this.handleAdd.bind(this)}
                          >Add
                          </Button>
                          <Button bsStyle="success"
                                  onClick={() =>
                                  this.setState({hideForm: !this.state.hideForm})}
                          >Toggle form visibility
                          </Button>
                        </Col>
                      </Row>
                    </Grid>

                    <Filters />

                    {
                      !this.state.hideForm ?
                          <TodoForm
                            list={this.state.list[index]}
                            index={index}
                            onChange={this.handleChange.bind(this)}
                          /> : null
                    }

                </div>
                <Grid className="game-info">
                  <Row>
                    <Col xs={8} md={8}>
                      <ol>{list}</ol>
                    </Col>
                  </Row>
                </Grid>
            </div>
        );
    }

    setCurrentIndex(index){
      console.log('!!! set', index)
        this.setState({currentIndex: index})
    }

    handleRemove(index, event) {
      event.stopPropagation();

      if (!confirm("Are u sure?")) return false;

      this.state.list.splice(index, 1);
      let newIndex = --this.state.currentIndex;
      newIndex = index < 0 ? 0 : newIndex;

      this.setState({
        list: this.state.list,
        currentIndex: newIndex
      })

    }

    handleAdd(){
        const index = this.state.list.length ? ++this.state.currentIndex : 0;
        this.setState(
            {
                list: this.state.list.concat(
                    [{
                        name: "",
                        descr: "",
                        priority: 0,
                        deadline: "",
                        enddate: "",
                        done: 0
                    }]),
                currentIndex: index
            }
        )
    }

    handleChange(index, field, event){
        let value;
        if (field === 'done') {
          value = event.target.checked ? 1 : 0
        } else {
          value = event.target.value
        }
        const item = this.state.list[index];
        item[field] = value;
        this.state.list[index] = item;

        this.setState({
            list: this.state.list
        });
    }
}


function formatDate(date){
  return date.toISOString().split('T')[0]
}


// ========================================
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
