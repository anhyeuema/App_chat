function getName(name) {
    alert(name);
}

var NameComponent = React.createClass({
    //cac trang thai cah hau dau phay
    addStudent: function () {
        this.setState({
            tongHocVien: this.state.tongHocVien + 1,
            // tongthisinh: parseInt(this.state.tongthisinh) + 1, //cong chuoi nen can parseIn de tro ve cong so
        });
    },
    tongStudent: function () {
        this.state.tongthisinh = parseInt(this.state.tongthisinh) + 1
        this.setState(
            this.state
            // tongthisinh: parseInt(this.state.tongthisinh) + 1, //cong chuoi nen can parseIn de tro ve cong so
        );
    },
    laythongtin: function () {
        alert(this.props.children);
    },

    getInitialState() {
        return {
            tongHocVien: 10,
            tongthisinh: this.props.tongthisinh,

        };
    },
    render: function () {
        return (
            <div>
                <div>
                    sohocvien : {this.state.tongHocVien}

                </div>
                <button onClick={() => {
                    this.addStudent();
                }}>them hoc vien</button>

                <div>
                    tong thi sinh:  {this.state.tongthisinh}
                </div>
                <button onClick={() => {
                    this.tongStudent();
                }}>them thi sinh</button>

                <h1 className="mauvang">{this.props.ten}- {this.props.giangvien}</h1>
                <p> {this.props.children} </p>
                <button onClick={this.laythongtin}>thong tin</button>
                <button onClick={() => {
                    var str = this.props.ten + this.props.giangvien;
                    getName(str);
                    getName(this.props.giangvien)
                }}>BAT SU KIEN</button>

                <Khoahoc />
            </div>
        );
    },

});

var Khoahoc = React.createClass({
    render: function () {
        return (
            <div>
                <h3>cccc</h3>
            </div>

        );
    },
});

var InputTag = React.createClass({
    show() {
        var text = this.refs.txt.value;
        alert(text);
    },
    showOption() {
        var option = this.refs.sl.value;
        alert(option);
    },
    render() {
        return (
            <div>
                <div>
                    <select ref="sl">
                        <option value="a">AAA</option>
                        <option value="b">BBB</option>
                        <option value="c">CCC</option>

                    </select>
                    <button onClick={() => {
                        this.showOption();
                    }}>hien thi option</button>
                </div>

                <div>
                    <input type="text" ref="txt" />
                    <button onClick={() => {
                        this.show();
                    }}>hien thi</button>
                </div>

            </div>
        );
    },
});

var Com = React.createClass({
    tangNum() {
        this.setState({
            num: this.state.num + 1,
        });
    },
    getInitialState: function () {
        return {
            num: 0,

        }
    },
    render: function () {
        return (
            <div>
                <button onClick={() => {
                    this.tangNum();
                }}>Hello{this.state.num}</button>
            </div>
        );
    }
});

var Album = React.createClass({
    xemtiep() {
        this.setState({
            Hinh: this.state.Hinh == 7 ? 1 : this.state.Hinh + 1,
        });
    },
    quaylai() {
        this.setState({
            Hinh: this.state.Hinh == 1 ? 7 : this.state.Hinh - 1,
        });
    },
    getInitialState: function () {
        return {
            Hinh: 1,
        };
    },
    render: function () {
        return (
            <div>
                <div className="div-ablum">
                    <img id="avata" src={"hotgirls/" + this.state.Hinh + ".jpg"}  ></img>
                </div>
                <hr />
                <div>
                    <button onClick={() => {
                        this.xemtiep();
                    }}>xem tiep</button>
                    <button onClick={() => {
                        this.quaylai();
                    }}>quay lai</button>
                </div>
            </div>
        );
    }
});

var Image = React.createClass({

    changImage() {
        this.setState({
            Hinh: (this.state.Hinh % 7) + 1
        });
    },
    getInitialState: function () {
        return {
            Hinh: 1,
        };
    },
    render: function () {
        return (
            <div>
                <img src={"hotgirls/" + this.state.Hinh + ".jpg"} id="avata" />
            </div>
        );
    },
    componentDidMount() {
        setInterval(this.changImage, 2 * 1000);
    }
});




var list;
var Note = React.createClass({
    cancel() {
        this.setState({ onEdit: false });
    },
    edit() {
        this.setState({ onEdit: true });

    },
    save() {
        var la_cai_Note = this;
        var x = { idSua: this.props.id, noidung: this.refs.txt.value };
        console.log('x:::', x);
        $.post("http://localhost:2400/update", x, (data) => {
            console.log('data edit:::', data);
            list.setState({ mang: data })
            la_cai_Note.setState({ onEdit: false });
        });
    },
    delete() {
        $.post("http://localhost:2400/delete", { idXoa: this.props.id }, function (data) {
            console.log('data xoa:::', data);
            list.setState({ mamg: data })
        })

    },
    getInitialState() {
        return {
            onEdit: false,
        }
    },
    render() {
        if (this.state.onEdit) {
            return (
                <div>
                    <img src={this.props.src}></img>
                    <input defaultValue={this.props.children} ref="txt" />
                    <button onClick={() => {
                        this.save();
                    }} >save</button>
                    <button onClick={() => {
                        this.cancel();
                    }} >huy</button>
                </div>
            )
        } else {
            return (
                <div>
                    <img src={this.props.src}></img>
                    <p>{this.props.children}</p>
                    <button onClick={() => {
                        this.delete();
                    }} >xoa </button>
                    <button onClick={() => {
                        this.edit();
                    }} >sua </button>
                </div>
            );
        }

    }
});

var List = React.createClass({
    add() {
        this.state.mang.unshift({ srcHinh: "hotgirls/10.jpg", noidung: "Node js Reactjs" });
        this.setState(this.state);
    },
    getInitialState() {
        return {
            mang: [
                { srcHinh: "hotgirls/1.jpg", noidung: "hello" },
                { srcHinh: "hotgirls/2.jpg", noidung: "anh yeu em" },
                { srcHinh: "hotgirls/3.jpg", noidung: "nhe " },
                { srcHinh: "hotgirls/4.jpg", noidung: "tinh " },
                { srcHinh: "hotgirls/5.jpg", noidung: "tianh" },
            ],
        }
    },
    render() {
        return (
            <div>
                <button onClick={() => {
                    this.add();
                }}>them</button>
                {
                    this.state.mang.map((note, index) => {
                        //  return <h1 key={i}>{note}</h1>
                        return <Note src={note.srcHinh} key={index}>{note.noidung}</Note>

                    })
                }
            </div>
        );
    }
});



function addDiv() {
    ReactDOM.render(
        <InputDiv />
        , document.getElementById("div-add")
    )
}
var List1 = React.createClass({
    getInitialState() {
        list = this;
        return {
            mang: []
        }
    },
    render() {
        return (
            <div>
                <div id="div-add"></div>
                <button onClick={() => {
                    addDiv();

                }}> them input div</button>
                {
                    this.state.mang.map(function (note, index) {
                        //  return <h1 key={i}>{note}</h1>
                        return <Note key={index} id={index}>{note}</Note>


                    })
                }
            </div>
        );
    },
    //khi render xong moi lay gia tri tu server ve
    componentDidMount() {
        var that = this;
        $.post("http://localhost:2400/getNotes", function (data) {
            console.log('data::', data);
            that.setState({
                mang: data
            });
        });
    }
})

var InputDiv = React.createClass({

    Send() {

        $.post("http://localhost:2400/add", { note: this.refs.txt.value }, function (data) {
            console.log('data::::', data);
            list.setState({ mamg: data })
        });
        // list.setState({ mang: list.state.mang.concat(this.refs.txt.value)});
        ReactDOM.unmountComponentAtNode(document.getElementById("div-add"));

    },
    getInitialState() {
        return {

        };
    },
    render() {
        return (
            <div>
                <input type="text" ref="txt" placeholder="enter you Note" />
                <button onClick={() => {
                    this.Send();
                }}> gui </button>
            </div>
        );
    }
});




ReactDOM.render(
    // React.createElement("h1", {}, "hoc react"),
    //<h1>hoc react</h1>, // muon hieu jsx phai dung babel-core
    // javascript = jsx thi dung babel-core  vs type = ""text/babel" mot so the dung do vi du the class dung do thay =className


    <div>
        <div>
            <Note>anh yeu em do em ak</Note>
        </div>
        <div>

            <List1 ></List1>

        </div>

        <div>
            <List ></List>
        </div>
        <div>

            <Image></Image>
            <Album></Album>
            <Com></Com>
            <InputTag > </InputTag>
            <NameComponent ten="ReactJS" giangvien="Mr.LINH" tongthisinh="11" >Mon Hoc react </NameComponent>
            <NameComponent ten="NodeJS" giangvien="Mr.LAN" tongthisinh="21" >Monhoc nodejs </NameComponent>

        </div>

    </div>
    , document.getElementById("root"))
