import Menu from './MenuComponent'
import Header from './HeaderComponent'
import Contact from './ContactComponent'
import Home from './HomeComponent'
import Footer from './FooterComponent'
import DishDetail from './DishdetailComponent'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import About from './AboutComponent'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import {
  postComment,
  postFeedback,
  fetchDishes,
  fetchComments,
  fetchPromos,
  fetchLeaders,
} from '../redux/ActionCreators'
import { actions } from 'react-redux-form'

const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders,
  }
}
const mapDispatchToProps = (dispatch) => ({
  postComment: (dishId, rating, author, comment) =>
    dispatch(postComment(dishId, rating, author, comment)),
  postFeedback: (feedback) => dispatch(postFeedback(feedback)),
  fetchDishes: () => {
    dispatch(fetchDishes())
  },
  fetchComments: () => {
    dispatch(fetchComments())
  },
  fetchPromos: () => {
    dispatch(fetchPromos())
  },
  fetchLeaders: () => {
    dispatch(fetchLeaders())
  },
  resetFeedbackForm: () => {
    dispatch(actions.reset('feedback'))
  },
})

class Main extends Component {
  componentDidMount() {
    this.props.fetchDishes()
    this.props.fetchComments()
    this.props.fetchPromos()
    this.props.fetchLeaders()
  }

  render() {
    const Homepage = () => {
      return (
        <Home
          dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
          dishesLoading={this.props.dishes.isLoading}
          dishesErrMess={this.props.dishes.errMess}
          promotion={
            this.props.promotions.promotions.filter(
              (promo) => promo.featured
            )[0]
          }
          promoLoading={this.props.promotions.isLoading}
          promoErrMess={this.props.promotions.errMess}
          leader={
            this.props.leaders.leaders.filter((leader) => leader.featured)[0]
          }
          leaderLoading={this.props.leaders.isLoading}
          leaderErrMess={this.props.leaders.errMess}
        ></Home>
      )
    }

    const DishWithId = ({ match }) => {
      return (
        <DishDetail
          dish={
            this.props.dishes.dishes.filter(
              (dish) => dish.id === parseInt(match.params.dishId, 10)
            )[0]
          }
          isLoading={this.props.dishes.isLoading}
          errMess={this.props.dishes.errMess}
          comments={this.props.comments.comments.filter(
            (comment) => comment.dishId === parseInt(match.params.dishId, 10)
          )}
          commentsErrMess={this.props.comments.errMess}
          postComment={this.props.postComment}
        />
      )
    }

    // const AboutUs = () => {
    //   return <About leaders={this.state.leaders}></About>
    // }

    return (
      <div>
        <Header />
        <TransitionGroup>
          <CSSTransition
            key={this.props.location.key}
            classNames='page'
            timeout={300}
          >
            <Switch>
              <Route path='/home' component={Homepage}></Route>
              <Route
                exact
                path='/menu'
                component={() => <Menu dishes={this.props.dishes} />}
              ></Route>
              <Route path='/menu/:dishId' component={DishWithId}></Route>
              <Route
                exact
                path='/contactus'
                component={() => (
                  <Contact
                    postFeedback={this.props.postFeedback}
                    resetFeedbackForm={this.props.resetFeedbackForm}
                  />
                )}
              ></Route>
              <Route
                exact
                path='/aboutus'
                component={() => <About leaders={this.props.leaders} />}
              />
              <Redirect to='/home'></Redirect>
            </Switch>
          </CSSTransition>
        </TransitionGroup>
        <Footer />
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main))
