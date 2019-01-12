

var list;
var Note = React.createClass({
    
    send(){
        var la_cai_Note = this;
        var x = { idSua: this.props.id, noidung: this.refs.txt.value };
        console.log('x:::', x);
        socket.on('server-send-socket.id+Username', ArraySocketUsername => {
            list.setState({ mang: ArraySocketUsername })
        });
        la_cai_Note.setState({ onEdit: false});
    },
    cancel(){
        this.setState({ onEdit: false });
    },
    Message() {
       // var note = this;
      //  alert(note.props.children);
        this.setState({ onEdit: true });

    },
    show() {
        alert(1);
        socket.on('server-send-socket.id+Username', ArraySocketUsername => {
            list.setState({ mang: ArraySocketUsername })
        });
        console.log('list.state.mang:::', list.state.mang);
    },
    getInitialState() {
        return {
            onEdit: false,
        }
    },
    render() {
        //this.props.children thân ben trong thằng Note de hung du lieu tu List đổ vao 
        if (this.state.onEdit) {
            
            return (
                <div>
                    <input defaultValue={this.props.children} ref="txt"/>
                    <button onClick={() => {
                        this.send();
                    }} >send</button>
                    <button onClick={() => {
                        this.cancel();
                    }} >huy</button>
                </div>

            )

        } else {
            return (
                <div>
                    <div>
                        <p>{this.props.children}</p>
                        <button onClick={() => {
                            this.show();
                        }}>show SocketId</button>
                        <button onClick={() => {
                            this.delete();
                        }} >xoa </button>
                        <button onClick={() => {
                            this.Message();
                        }} >Message </button>
                    </div>
                </div>
            )
        }
      
    }
})


var List = React.createClass({

    getInitialState() {
        list = this;
        return {
            mang: [

            ],
        };
    },
    render() {
        return (
            <div>
                {
                    this.state.mang.map(function (value, index) {

                        // return <h1>{value.UserSocketId}</h1>
                        return (
                            <Note key={index}>
                                {
                                    <a>{value.UserSocketId}</a>

                                }
                                {
                                    <a>: {value.Username}</a>
                                }
                                {
                                    console.log('value:::', value.UserSocketId)
                                }
                            </Note>
                        );
                    })
                }
            </div>
        );
    },
    componentDidMount() {
        var that = this;
        socket.on('server-send-socket.id+Username', ArraySocketUsername => {
            that.setState({ mang: ArraySocketUsername });
        });


    }
})


ReactDOM.render(
    <div>
        <div>
            <Note></Note>
        </div>
        <div>
            <List></List>
        </div>
        <div>


            <a>hello</a>
        </div>
    </div>
    , document.getElementById("root")
)