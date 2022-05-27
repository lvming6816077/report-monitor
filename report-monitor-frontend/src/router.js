
import { Home } from './pages/home/Home'
import { CreateTag } from './pages/point/CreateTag'
import { CreatePoint } from './pages/point/CreatePoint'
import { PointList } from './pages/point/PointList'
import { UserList } from './pages/setting/UserList'
import { TagList } from './pages/point/TagList'
import { PointSet } from './pages/setting/PointSet'
import { Login } from './pages/login/Login'


const routes = [
  { path: "/", name: "home", component: Home, auth: [1] },
  { path: "/login", name: "login", component: Login, auth: [], },
  {
    path: "/createtag",
    name: "createtag",
    component: CreateTag,
    auth: [1]
  },
  {
    path: "/createpoint",
    name: "createpoint",
    component: CreatePoint,
    auth: [1]
  },
  {
    path: "/pointset",
    name: "pointset",
    component: PointSet,
    auth: [1]
  },
  {
    path: "/pointlist",
    name: "pointlist",
    component: PointList,
    auth: [1]
  },
  {
    path: "/userlist",
    name: "userlist",
    component: UserList,
    auth: [1,0]
  },
  {
    path: "/taglist",
    name: "taglist",
    component: TagList,
    auth: [1]
  },
]

export default routes
