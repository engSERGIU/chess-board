/** Copyright (c) 2012 Ajax Isepic (ajax333221) Licensed MIT */var PiecesNames="*pnbrqk";function fixSpacing(rtn_string){	return rtn_string.replace(/^\s+|\s+$/g,"").replace(/\s\s+/g," ");}function countChars(str_len,str,char_to_count){	return (str_len-(str.replace(RegExp(char_to_count,"g"),"")).length);}function bosToPos(bos){	return [(8-(bos.charAt(1)*1)),"abcdefgh".indexOf(bos.charAt(0))];//old: Math.abs((bos.charAt(1)*1)-8)}function posToBos(pos){	return ("abcdefgh".charAt(pos[1])+""+(8-pos[0]));//old: Math.abs(pos[0]-8)}function insideBoard(pos){	return ((pos[0]<8&&pos[0]>-1)&&(pos[1]<8&&pos[1]>-1));}function getValue(pos,obj){	return obj.ChessBoard[pos[0]][pos[1]];}function setValue(pos,new_val,obj){	obj.ChessBoard[pos[0]][pos[1]]=new_val;}function toggleActiveColor(obj){	obj.ActiveColor=!obj.ActiveColor;}function toggleIsRotated(obj){	obj.IsRotated=!obj.IsRotated;}function setKingPos(new_pos,obj){	if(obj.ActiveColor){		obj.BKingPos=new_pos;	}else{		obj.WKingPos=new_pos;	}}function countChecks(early_break,obj){	var i,j,king_pos,as_knight,rtn_num_checks;		rtn_num_checks=0;	king_pos=obj.ActiveColor?obj.BKingPos:obj.WKingPos;		outer:	for(i=2;i--;){//1...0		as_knight=!i;				for(j=9;--j;){//8...1			if(testIsAttacked(king_pos,j,null,as_knight,obj)){				rtn_num_checks++;								if(early_break){					break outer;				}			}		}	}		return rtn_num_checks;}function setCurrentMove(val,is_goto,obj){	var len,tmp;		len=obj.MoveList.length;		if(len>1){		tmp=Math.min(Math.max((val+(is_goto?0:obj.CurrentMove)),0),(len-1));				if(tmp-obj.CurrentMove){//old: (x!=y)			obj.CurrentMove=tmp;						readFen(obj.MoveList[tmp][0],false,obj);			displayBoard(obj);						if(tmp==(len-1)){UGLY_FUNCTION();}/*nnnnnnnnn*/		}	}}function cornerRookTest(rtn_castling_avility,file){	if(rtn_castling_avility){		if(file>6&&(rtn_castling_avility-2)){//short old: (x==7 && y!=2)			rtn_castling_avility--;		}else if(!file&&rtn_castling_avility>1){//long old: (x==0 && ...)			rtn_castling_avility-=2;		}	}		return rtn_castling_avility;}function displayBoard(obj){	var i,j,len,temp,temp2,current_pos,castling_holder,square_color,clock_toggler,move_list,move_text,initial_fullmove,bonus_half,html_board;		castling_holder=["-","k","q","kq"];		html_board="<table cellpadding='0' cellspacing='0'><tbody>";	square_color=true;		for(i=0;i<8;i++){//0...7		html_board+="<tr>";				for(j=0;j<8;j++){//0...7			current_pos=(obj.IsRotated?[(7-i),(7-j)]:[i,j]);//old: [Math.abs(i-7),Math.abs(j-7)]			temp=getValue(current_pos,obj);						html_board+="<td class='"+(square_color?"w":"b")+"s"+(temp?((temp<0?" b":" w")+""+PiecesNames.charAt(Math.abs(temp))):"")+"' id='"+posToBos(current_pos)+"'></td>";			square_color=!square_color;		}				html_board+="</tr>";		square_color=!square_color;	}		html_board+="</tbody></table>";		move_list=obj.MoveList;	bonus_half=(~move_list[0][0].indexOf(" b ")?0.5:0);/*NO " b" or "b " because false-positives*/	clock_toggler=!bonus_half;	initial_fullmove=obj.InitialFullMove;	move_text="";		/*reverse? cambiando x+=y por x=y+x?*/	for(i=1,len=move_list.length;i<len;i++){//1<len		move_text+=(i-1?" ":"")+(clock_toggler?("<span>"+(initial_fullmove+Math.floor(((i-1)/2)+bonus_half))+".</span>"):"")+"<span id='xpgn"+i+"' class='"+(i==obj.CurrentMove?"xpgn_active":"xpgn_goto")+"'>"+move_list[i][1]+"</span>";				clock_toggler=!clock_toggler;	}		if(bonus_half&&move_text){		move_text="<span>"+initial_fullmove+"...</span>"+move_text;	}		/*rewrite this v*/	html_board+="<input id='xfen' type='text' value='"+obj.Fen+"' />"	+"<br><input id='xgoto0' type='button' value='|<' style='width:25' /> <input id='xgoto1' type='button' value='<' style='width:25' /> <input id='xgoto2' type='button' value='>' style='width:25' /> <input id='xgoto3' type='button' value='>|' style='width:25' /> | <input id='xrotate' type='button' value='rotate' style='width:50' />"	+"<br><pre style='display:inline;'>to move:</pre> <span style='color:#546AC1;'>"+(obj.ActiveColor?"b":"w")+"</span>"	+"<br><pre style='display:inline;'>board view:</pre> <span style='color:#546AC1;'>"+(obj.IsRotated?"b (rotated)":"w")+"</span>"	+"<br><pre style='display:inline;'>active checks:</pre> <span style='color:#546AC1;'>"+obj.ActiveChecks+"</span>"	+"<br><pre style='display:inline;'>en passant:</pre> <span style='color:#546AC1;'>"+(obj.EnPassantBos||"-")+"</span>"	+"<br><pre style='display:inline;'>w_castling:</pre> <span style='color:#546AC1;'>"+(castling_holder[obj.WCastling].toUpperCase())+"</span>"	+"<br><pre style='display:inline;'>b_castling:</pre> <span style='color:#546AC1;'>"+(castling_holder[obj.BCastling])+"</span>"	+"<br><pre style='display:inline;'>w_king pos:</pre> <span style='color:#546AC1;'>"+posToBos(obj.WKingPos)+"</span>"	+"<br><pre style='display:inline;'>b_king pos:</pre> <span style='color:#546AC1;'>"+posToBos(obj.BKingPos)+"</span>"	+"<br><pre style='display:inline;'>half moves:</pre> <span style='color:#546AC1;'>"+obj.HalfMove+"</span>"	+"<br><pre style='display:inline;'>full moves:</pre> <span style='color:#546AC1;'>"+obj.FullMove+"</span>"	+"<br><pre style='display:inline;'>current move:</pre> <span style='color:#546AC1;'>"+obj.CurrentMove+"</span>"	+"<br><pre style='display:inline;'>move list:</pre> <span style='color:#546AC1;'>"+(move_text||"-")+"</span>";	/*rewrite this ^*/		temp2=$("#xchessboard");		if(!temp2.length){		$("body").append("<div id='xchessboard'>"+html_board+"</div>");	}else{		temp2.html(html_board);	}		/*rewrite this v*/	$("#xfen").click(function(){$(this).select();});	$("#xgoto0").click(function(){setCurrentMove(0,true,obj);});	$("#xgoto1").click(function(){setCurrentMove(-1,false,obj);});	$("#xgoto2").click(function(){setCurrentMove(1,false,obj);});	$("#xgoto3").click(function(){setCurrentMove(10000,true,obj);});		$("#xrotate").click(function(){		toggleIsRotated(obj);		displayBoard(obj);		if(obj.CurrentMove==(obj.MoveList.length-1)){UGLY_FUNCTION();}/*nnnnnnnnn*/	});		$(".xpgn_goto").click(function(){setCurrentMove((this.id.substring(4)*1),true,obj);});		if(obj.CurrentMove){		$("#"+move_list[obj.CurrentMove][2][0]).addClass("lastmove");		$("#"+move_list[obj.CurrentMove][2][1]).addClass("lastmove");	}	/*rewrite this ^*/}function createBoard(nam,complete_fen,rotate_board){	var target_board;		target_board=window[nam]={		ChessBoard:null,		Fen:null,		ActiveColor:null,		ActiveChecks:null,		WCastling:null,		BCastling:null,		EnPassantBos:null,		HalfMove:null,		FullMove:null,		WKingPos:null,		BKingPos:null,		InitialFullMove:null,		MoveList:null,		CurrentMove:null,		IsRotated:null	};		readFen(complete_fen,true,target_board);		if(rotate_board){		toggleIsRotated(target_board);	}		displayBoard(target_board);}function readFen(complete_fen,is_creating,obj){	var i,j,len,temp,temp2,fen_ranks,current_file,skip_files,piece_char,fen_parts;		obj.ChessBoard=new Array(8);		for(i=8;i--;){//7...0		obj.ChessBoard[i]=[0,0,0,0,0,0,0,0];	}		if(is_creating){		if(typeof complete_fen!=="string"){			complete_fen="";		}				complete_fen=fixSpacing(complete_fen);		complete_fen=(preFenValidation(complete_fen)?complete_fen:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");	}		fen_parts=complete_fen.split(" ");	fen_ranks=fen_parts[0].split("/");		for(i=8;i--;){//7...0		current_file=0;				for(j=0,len=fen_ranks[i].length;j<len;j++){//0<len			temp=fen_ranks[i].charAt(j);			skip_files=(temp*1);						if(!skip_files){				piece_char=temp.toLowerCase();				setValue([i,current_file],(PiecesNames.indexOf(piece_char)*(temp==piece_char?-1:1)),obj);			}						current_file+=(skip_files||1);						//old:			//			//if(skip_files){			//	current_file+=skip_files;			//}else{			//	piece_char=temp.toLowerCase();			//	setValue([i,current_file],(PiecesNames.indexOf(piece_char)*(temp==piece_char?-1:1)),obj);			//	current_file++;			//}		}	}		obj.ActiveColor=(fen_parts[1]=="b");		temp2=fen_parts[2];	obj.WCastling=(~temp2.indexOf("K")?1:0)+(~temp2.indexOf("Q")?2:0);	obj.BCastling=(~temp2.indexOf("k")?1:0)+(~temp2.indexOf("q")?2:0);		obj.EnPassantBos=fen_parts[3].replace("-","");		obj.HalfMove=(fen_parts[4]*1)||0;	obj.FullMove=(fen_parts[5]*1)||1;		nodomRefresh(obj);		if(is_creating){		obj.InitialFullMove=obj.FullMove;		obj.MoveList=[[complete_fen,"",["",""]]];		obj.CurrentMove=0;		obj.IsRotated=false;				if(!postFenValidation(obj)){			readFen(null,is_creating,obj);//'is_creating' always true		}	}}function nodomRefresh(obj){	var i,j,piece_char,current_pos,current_val,current_abs_val,empty_squares,new_fen_first,castling_holder,current_is_white;		castling_holder=["","k","q","kq"];	new_fen_first="";		for(i=0;i<8;i++){//0...7		empty_squares=0;				for(j=0;j<8;j++){//0...7			current_pos=[i,j];			current_val=getValue(current_pos,obj);						if(current_val){				if(empty_squares){					new_fen_first+=""+empty_squares;					empty_squares=0;				}								current_abs_val=Math.abs(current_val);				current_is_white=(current_val>0);								if(current_abs_val>5){//old: (x==6)					if(current_is_white){						obj.WKingPos=current_pos;					}else{						obj.BKingPos=current_pos;					}				}								piece_char=PiecesNames.charAt(current_abs_val);				new_fen_first+=""+(current_is_white?piece_char.toUpperCase():piece_char);			}else{				empty_squares++;			}		}				new_fen_first+=""+(empty_squares||"")+(i-7?"/":"");//old: (i!=7?"/":"")	}		obj.Fen=(new_fen_first+" "+(obj.ActiveColor?"b":"w")+" "+((castling_holder[obj.WCastling].toUpperCase()+""+castling_holder[obj.BCastling])||"-")+" "+(obj.EnPassantBos||"-")+" "+obj.HalfMove+" "+obj.FullMove);		obj.ActiveChecks=countChecks(false,obj);}function preFenValidation(complete_fen){	var i,j,len,temp,optional_clocks,last_is_num,current_is_num,fen_ranks,piece_char,num_pieces,fen_first,fen_first_len,num_files,keep_going,rtn_is_legal;		rtn_is_legal=false;		if(complete_fen){		optional_clocks=complete_fen.replace(/^([rnbqkRNBQK1-8]+\/)([rnbqkpRNBQKP1-8]+\/){6}([rnbqkRNBQK1-8]+)\s[bw]\s(-|K?Q?k?q?)\s(-|[a-h][36])($|\s)/,"");		keep_going=(complete_fen.length-optional_clocks.length);//old: (x!=y)				if(keep_going){			if(optional_clocks.length){				keep_going=(/^(0|[1-9][0-9]*)\s([1-9][0-9]*)$/.test(optional_clocks));			}						if(keep_going){				fen_first=complete_fen.split(" ",1)[0];				fen_first_len=fen_first.length;								if((countChars(fen_first_len,fen_first,"K")==1)&&(countChars(fen_first_len,fen_first,"k")==1)){					fen_ranks=fen_first.split("/");										outer:					for(i=8;i--;){//7...0						num_files=0;						last_is_num=false;												/*reverse? mmm*/						for(j=0,len=fen_ranks[i].length;j<len;j++){//0<len							temp=(fen_ranks[i].charAt(j)*1);							current_is_num=!!temp;														if(last_is_num&&current_is_num){								keep_going=false;								break outer;							}														last_is_num=current_is_num;														num_files+=(temp||1);						}												if(num_files-8){//old: (x!=8)							keep_going=false;							break;						}					}										if(keep_going){						for(i=2;i--;){//1...0							num_pieces=new Array(5);														for(j=5;j--;){//4...0								piece_char=PiecesNames.charAt(j+1);								if(i){piece_char=piece_char.toUpperCase();}																num_pieces[j]=countChars(fen_first_len,fen_first,piece_char);							}														if(!((num_pieces[0]<9)&&((Math.max(num_pieces[1]-2,0)+Math.max(num_pieces[2]-2,0)+Math.max(num_pieces[3]-2,0)+Math.max(num_pieces[4]-1,0))<=(8-num_pieces[0])))){								keep_going=false;								break;							}						}												rtn_is_legal=keep_going;					}				}			}		}	}		return rtn_is_legal;}function postFenValidation(obj){	var i,j,k,temp,temp2,temp3,keep_going,enpass_pos,castling_availity,king_rank,enpass_rank,enpass_file,fen_first,num_pawns,missing_capturables,min_captured,min_captured_holder,castle_holder,rtn_is_legal;		rtn_is_legal=false;		if(obj.HalfMove<=(((obj.FullMove-1)*2)+obj.ActiveColor)){		if(obj.WKingPos&&obj.BKingPos){			if((getValue(obj.WKingPos,obj)>5)&&(getValue(obj.BKingPos,obj)<-5)){//old: (y==6 && x==-6)				if(obj.ActiveChecks<3){					toggleActiveColor(obj);					keep_going=!countChecks(true,obj);					toggleActiveColor(obj);										if(keep_going){						if(obj.EnPassantBos){							keep_going=false;														if(!obj.HalfMove){								enpass_pos=bosToPos(obj.EnPassantBos);																if(!getValue(enpass_pos,obj)){									if(obj.ActiveColor){										temp=5;										temp2=1;									}else{										temp=2;										temp2=-1;									}																		enpass_rank=enpass_pos[0];									enpass_file=enpass_pos[1];																		keep_going=(enpass_rank==temp&&!getValue([(enpass_rank+temp2),enpass_file],obj)&&(getValue([enpass_rank+(-temp2),enpass_file],obj)==temp2));								}							}						}												if(keep_going){							fen_first=obj.Fen.split(" ")[0];														for(i=2;i--;){//1...0								missing_capturables=(15-countChars(fen_first.length,fen_first,(i?"p|n|b|r|q":"P|N|B|R|Q")));								min_captured=0;																for(j=8;j--;){//7...0									min_captured_holder=((j>6)||!j)?[1,3,6,10,99]:[1,2,4,6,9];//old: (j==7 || j==0)									temp3="..";																		for(k=8;k--;){//7...0										temp3+=""+(getValue([k,j],obj)||"")+"..";									}																		num_pawns=temp3.match(i?/\.1\./g:/\.-1\./g);/*rewrite this*/									num_pawns=(num_pawns?num_pawns.length:0);																		if(num_pawns>1){										min_captured+=min_captured_holder[num_pawns-2];									}								}																if(min_captured>missing_capturables){									keep_going=false;									break;								}							}														if(keep_going){								for(i=2;i--;){//1...0									castle_holder=i?[0,-6,-4,obj.BCastling]:[7,6,4,obj.WCastling];									castling_availity=castle_holder[3];																		if(castling_availity){										king_rank=castle_holder[0];																				if(getValue([king_rank,4],obj)-castle_holder[1]){//old: (x!=y)											keep_going=false;										}else if(castling_availity-2&&(getValue([king_rank,7],obj)-castle_holder[2])){//old: (x!=2 && x!=y), old2: ((x==1 || x==3) && x!=y)											keep_going=false;										}else if((castling_availity>1)&&(getValue([king_rank,0],obj)-castle_holder[2])){//old: (x>1 && x!=y), old2: ((x==2 || x==3) && x!=y)											keep_going=false;										}									}																		if(!keep_going){										break;									}								}																rtn_is_legal=keep_going;							}						}					}				}			}		}	}		return rtn_is_legal;}function testCandidateMoves(initial_pos,piece_direction,num_squares,as_knight,allow_capture,obj){	return testCollision(initial_pos,piece_direction,num_squares,as_knight,allow_capture,false,null,obj)[0];}function testIsAttacked(initial_pos,piece_direction,num_squares,as_knight,obj){	return testCollision(initial_pos,piece_direction,num_squares,as_knight,false,true,null,obj)[1];}function testDisambiguationPos(initial_pos,piece_direction,num_squares,as_knight,ally_abs_val,obj){	return testCollision(initial_pos,piece_direction,num_squares,as_knight,false,false,ally_abs_val,obj)[2];}function testCollision(initial_pos,piece_direction,num_squares,as_knight,allow_capture,request_is_attacked,ally_abs_val,obj){	var i,move_by,current_rank,current_file,current_pos,current_val,impossible_to_name,movement_holder,rtn_arr_pos,rtn_is_attacked,rtn_ally_pos;		movement_holder=as_knight?[[-2,1],[-1,2],[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1]]:[[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];		rtn_arr_pos=[];	rtn_is_attacked=false;	rtn_ally_pos=[];	num_squares=(as_knight?1:(num_squares||7));/*NO use math max 7, even if 999 the loop breaks on outside board*/	move_by=movement_holder[piece_direction-1];		current_rank=initial_pos[0];	current_file=initial_pos[1];		for(i=0;i<num_squares;i++){//0<num_squares		current_rank+=move_by[0];		current_file+=move_by[1];		current_pos=[current_rank,current_file];				if(!insideBoard(current_pos)){			break;		}				current_val=getValue(current_pos,obj);				if(current_val){			impossible_to_name=(current_val*(obj.ActiveColor?1:-1));						if(impossible_to_name>0){//old: if((obj.ActiveColor&&current_val>0)||(!obj.ActiveColor&&current_val<0)){				if(request_is_attacked){					if(as_knight){						if(impossible_to_name==2){//knight							rtn_is_attacked=true;						}					}else if(impossible_to_name>5){//king, old: (x==6)						if(!i){							rtn_is_attacked=true;						}					}else if(impossible_to_name>4){//queen, old: (x==5)						rtn_is_attacked=true;					}else if(piece_direction%2){						if(impossible_to_name>3){//rook, old: (x==4)							rtn_is_attacked=true;						}										/*NO >2, we can collide with rooks*/					}else if(impossible_to_name==3){//bishop						rtn_is_attacked=true;					}else if(!i&&impossible_to_name<2){//old: (... && x==1)						if(~current_val){//w_pawn							if(piece_direction==4||piece_direction==6){								rtn_is_attacked=true;							}						}else{//b_pawn							/*NO merge in a single else if, the minimizer will do this*/							if(piece_direction<3||piece_direction>7){//old: (x==2 || x==8)								rtn_is_attacked=true;							}						}					}				}								if(allow_capture&&impossible_to_name<6){//old: (... && x!=6)					rtn_arr_pos.push(current_pos);				}			}else if(ally_abs_val==-impossible_to_name){				rtn_ally_pos=current_pos;			}						break;		}else{			rtn_arr_pos.push(current_pos);		}	}		return [rtn_arr_pos,rtn_is_attacked,rtn_ally_pos];}function legalMoves(piece_pos,obj){	var i,j,len,len2,temp,temp2,temp_board,non_active_sign,facing_rank,current_adjacent_file,piece_val,impossible_to_name,current_pos,diagonal_pawn_pos,enpass_pos,pre_validated_arr_pos,can_castle,active_king_rank,is_king,as_knight,captured_en_passant,piece_rank,multi_holder,rtn_validated_arr_pos;		temp_board=window["xlegal"]=JSON.parse(JSON.stringify(obj));		multi_holder=temp_board.ActiveColor?[5,1,temp_board.BCastling,0]:[1,-1,temp_board.WCastling,7];		captured_en_passant="";	pre_validated_arr_pos=[];	rtn_validated_arr_pos=[];		if(insideBoard(piece_pos)){		piece_val=getValue(piece_pos,obj);		non_active_sign=multi_holder[1];		impossible_to_name=(piece_val*-non_active_sign);				if(impossible_to_name>0){//old: if((obj.ActiveColor&&piece_val<0)||(!obj.ActiveColor&&piece_val>0)){			is_king=(impossible_to_name>5);//old: (x==6)			active_king_rank=multi_holder[3];						if(is_king){//king				for(i=9;--i;){//8...1					if((temp=testCandidateMoves(piece_pos,i,1,false,true,temp_board)).length){pre_validated_arr_pos.push(temp);}				}								if(multi_holder[2]&&!temp_board.ActiveChecks&&posToBos(piece_pos)==("e"+(8-active_king_rank))){					for(i=2;i--;){//1...0						if(multi_holder[2]-(i?1:2)){//old: (x!=y)							if(testCandidateMoves(piece_pos,(i?7:3),(i+2),false,false,temp_board).length==(i+2)){								can_castle=true;																for(j=2;j--;){//1...0									setKingPos([active_king_rank,(j+(i?2:5))],temp_board);//3...2 or 6...5																		if(countChecks(true,temp_board)){										can_castle=false;										break;									}								}																if(can_castle){									pre_validated_arr_pos.push([[active_king_rank,(i?2:6)]]);								}							}						}					}										/*NO revert original king pos, temp_board will get overwritten soon*/				}			}else if(impossible_to_name<2){//pawn, old: (x==1)				piece_rank=piece_pos[0];								if((temp=testCandidateMoves(piece_pos,multi_holder[0],((piece_rank==(active_king_rank+non_active_sign))+1),false,false,temp_board)).length){pre_validated_arr_pos.push(temp);}//old: ((piece_rank==multi_holder[x])+1), old2: ((piece_rank==multi_holder[x])?2:1)								facing_rank=(piece_rank+non_active_sign);								for(i=2;i--;){//1...0					current_adjacent_file=(piece_pos[1]+((i*2)-1));//old: (i?1:-1)					diagonal_pawn_pos=[facing_rank,current_adjacent_file];										if(insideBoard(diagonal_pawn_pos)){						temp2=(getValue(diagonal_pawn_pos,temp_board)*non_active_sign);												/*NO use (x && ...), we have negative numbers too*/						if(temp2>0&&temp2<6){//old: (x>0 && x!=6)							pre_validated_arr_pos.push([diagonal_pawn_pos]);						}else if(facing_rank==(active_king_rank+(non_active_sign*5))&&temp_board.EnPassantBos){							enpass_pos=bosToPos(temp_board.EnPassantBos);														if(enpass_pos[0]==facing_rank&&enpass_pos[1]==current_adjacent_file){								captured_en_passant=posToBos([piece_rank,current_adjacent_file]);								pre_validated_arr_pos.push([diagonal_pawn_pos]);							}						}					}				}			}else{//knight, bishop, rook, queen				as_knight=(impossible_to_name<3);//old: (x==2)								for(i=(impossible_to_name-3?9:1);--i;){//7,5,3,1, old: (x!=3?9:1)					if((temp=testCandidateMoves(piece_pos,--i,null,as_knight,true,temp_board)).length){pre_validated_arr_pos.push(temp);}				}								for(i=(impossible_to_name-4?9:1);--i;){//8,6,4,2, old: (x!=4?9:1)					if((temp=testCandidateMoves(piece_pos,i--,null,as_knight,true,temp_board)).length){pre_validated_arr_pos.push(temp);}				}			}						/*reverse x2?*/			for(i=0,len=pre_validated_arr_pos.length;i<len;i++){//0<len				for(j=0,len2=pre_validated_arr_pos[i].length;j<len2;j++){//0<len2					temp_board=window["xlegal"]=JSON.parse(JSON.stringify(obj));					current_pos=pre_validated_arr_pos[i][j];										setValue(piece_pos,0,temp_board);					setValue(current_pos,piece_val,temp_board);										if(is_king){						setKingPos(current_pos,temp_board);					}else if(captured_en_passant&&(posToBos(current_pos)==temp_board.EnPassantBos)){						setValue(bosToPos(captured_en_passant),0,temp_board);					}										if(!countChecks(true,temp_board)){						rtn_validated_arr_pos.push(current_pos);					}				}			}		}	}		window["xlegal"]=null;/*porque "temp_board=null" no funciona?*/		return rtn_validated_arr_pos;}function moveCaller(initial_pos,final_pos,obj){	if(insideBoard(final_pos)){		if(~(legalMoves(initial_pos,obj).join("")).indexOf(final_pos.join())){			makeMove(initial_pos,final_pos,obj);		}	}		//old:	//	//for(i=0,len=legal_moves.length;i<len;i++){	//	if(posToBos(legal_moves[i])==final_bos){	//		makeMove(initial_pos,final_pos,obj);	//			//		break;	//	}	//}}function makeMove(initial_pos,final_pos,obj){	var active_sign,active_color_king_rank,pawn_moved,promoted_val,piece_val,piece_abs_val,initial_bos,final_bos,destination_file_char,active_color_rook,new_enpass_bos,new_active_castling_availity,new_nonactive_castling_availity,king_castling,non_enpassant_capture,to_promotion_rank,pgn_move,multi_holder;		multi_holder=obj.ActiveColor?[7,0,6,4,-1,obj.BCastling,obj.WCastling]:[0,7,3,5,1,obj.WCastling,obj.BCastling];		initial_bos=posToBos(initial_pos);	final_bos=posToBos(final_pos);		destination_file_char=final_bos.charAt(0);		to_promotion_rank=(final_pos[0]==multi_holder[0]);		active_sign=multi_holder[4];	active_color_rook=(4*active_sign);		pawn_moved=false;	new_enpass_bos="";	promoted_val=0;	king_castling=0;	non_enpassant_capture=getValue(final_pos,obj);	new_active_castling_availity=multi_holder[5];	new_nonactive_castling_availity=multi_holder[6];		piece_val=getValue(initial_pos,obj);	piece_abs_val=(piece_val*active_sign);//old: Math.abs(piece_val)		active_color_king_rank=multi_holder[1];		if(piece_abs_val>5){//king, old: (x==6)		new_active_castling_availity=0;				if(Math.abs(initial_pos[1]-final_pos[1])>1){						if(final_pos[1]==6){//short				king_castling=1;								setValue([active_color_king_rank,5],active_color_rook,obj);				setValue([active_color_king_rank,7],0,obj);			}else if(final_pos[1]==2){//long				king_castling=2;								setValue([active_color_king_rank,3],active_color_rook,obj);				setValue([active_color_king_rank,0],0,obj);			}		}	}else if(piece_abs_val<2){//pawn, old: (x==1)		pawn_moved=true;				if(Math.abs(initial_pos[0]-final_pos[0])>1){//new enpass			new_enpass_bos=(destination_file_char+""+multi_holder[2]);		}else if(final_bos==obj.EnPassantBos){//pawn x enpass			setValue(bosToPos(destination_file_char+""+multi_holder[3]),0,obj);		}else if(to_promotion_rank){//promotion			promoted_val=(5*active_sign);/*change val using combobox*/		}	}		pgn_move=getNotation(initial_bos,final_bos,piece_abs_val,promoted_val,king_castling,non_enpassant_capture,obj);/*NO move below*/		obj.HalfMove++;	if(pawn_moved||non_enpassant_capture){		obj.HalfMove=0;	}		if(piece_abs_val==4&&initial_pos[0]==active_color_king_rank){		new_active_castling_availity=cornerRookTest(new_active_castling_availity,initial_pos[1]);	}		if(non_enpassant_capture==-active_color_rook&&to_promotion_rank){		new_nonactive_castling_availity=cornerRookTest(new_nonactive_castling_availity,final_pos[1]);	}		if(active_color_king_rank){//white moving		obj.WCastling=new_active_castling_availity;		obj.BCastling=new_nonactive_castling_availity;	}else{//black moving		obj.FullMove++;				obj.WCastling=new_nonactive_castling_availity;		obj.BCastling=new_active_castling_availity;	}		obj.EnPassantBos=new_enpass_bos;/*NO move this up*/		setValue(final_pos,(promoted_val||piece_val),obj);	setValue(initial_pos,0,obj);		toggleActiveColor(obj);	nodomRefresh(obj);		/*if estamos en (currentMove!=max) variacion o overwrite?*/		obj.MoveList.push([obj.Fen,(pgn_move+(obj.ActiveChecks?"+":"")),[initial_bos,final_bos]]);/*# con mate*/	obj.CurrentMove++;/*y si estamos a la mitad?*/		displayBoard(obj);}function getNotation(initial_bos,final_bos,piece_abs_val,promoted_val,king_castling,non_enpassant_capture,obj){	var i,len,temp,temp2,temp3,initial_file_char,initial_rank_char,final_pos,collition_bos,ambiguity,as_knight,rtn_new_move;		rtn_new_move="";	initial_file_char=initial_bos.charAt(0);		if(king_castling){//castling king		rtn_new_move+=(king_castling>1?"O-O-O":"O-O");	}else if(piece_abs_val<2){//pawn, old: (x==1)		if(initial_file_char!=final_bos.charAt(0)){			rtn_new_move+=(initial_file_char+"x");		}				rtn_new_move+=final_bos;				if(promoted_val){			rtn_new_move+=("="+PiecesNames.charAt(Math.abs(promoted_val)).toUpperCase());		}	}else{//knight, bishop, rook, queen, non-castling king		rtn_new_move+=PiecesNames.charAt(piece_abs_val).toUpperCase();				if(piece_abs_val<6){//knight, bishop, rook, queen, old: (x!=6)			temp2=[];			final_pos=bosToPos(final_bos);			as_knight=(piece_abs_val<3);//old: (x==2)						for(i=(piece_abs_val-3?9:1);--i;){//7,5,3,1 old: (x!=3?9:1)				if((temp=testDisambiguationPos(final_pos,--i,null,as_knight,piece_abs_val,obj)).length){temp2.push(temp);}			}						for(i=(piece_abs_val-4?9:1);--i;){//8,6,4,2 old: (x!=4?9:1)				if((temp=testDisambiguationPos(final_pos,i--,null,as_knight,piece_abs_val,obj)).length){temp2.push(temp);}			}						len=temp2.length;			if(len>1){				temp3="";								/*reverse?*/				for(i=0;i<len;i++){//0<len					collition_bos=posToBos(temp2[i]);										if(collition_bos!=initial_bos){						if(~(legalMoves(temp2[i],obj).join("")).indexOf(final_pos.join())){							temp3+=collition_bos;						}					}				}								initial_rank_char=initial_bos.charAt(1);				ambiguity=(!!(~temp3.indexOf(initial_file_char))*1)+(!!(~temp3.indexOf(initial_rank_char))*2);								if(ambiguity>2){					rtn_new_move+=(initial_file_char+""+initial_rank_char);				}else if(ambiguity==1){					rtn_new_move+=initial_rank_char;				}else{					rtn_new_move+=initial_file_char;				}			}		}				if(non_enpassant_capture){			rtn_new_move+="x";		}				rtn_new_move+=final_bos;	}		return rtn_new_move;}/*-----------*/var I,LEN,LEGALMOVES,ORIGIN="";function UGLY_FUNCTION(){	$(".ws,.bs").click(function(){		if(ORIGIN){			$(".ws,.bs").unbind('click');			$(".highlight").removeClass("highlight");			moveCaller(bosToPos(ORIGIN),bosToPos(this.id),xboard);			ORIGIN="";			UGLY_FUNCTION();		}else{			LEGALMOVES=legalMoves(bosToPos(this.id),xboard);			LEN=LEGALMOVES.length;						if(LEN){				ORIGIN=this.id;				$(this).addClass("highlight");								for(I=0;I<LEN;I++){					$("#"+posToBos(LEGALMOVES[I])).addClass("highlight");				}			}		}	});}