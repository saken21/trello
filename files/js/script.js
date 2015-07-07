(function($) {
	
	var VERSION = '1.00.01';
	
	/* =======================================================================
	Constructor
	========================================================================== */
	(function() {
		
		init();
		return false;
		
	})();
	
	function init() {
		
		if (!window.FileReader) return false;
		
		var file;
		var imageSize = 180;
		
		var $win = $(window);
		
		$win.bind("dragenter",onEnter);
		$win.bind("dragover",onOver);
		$win.bind("drop",onDrop);
		
		function onDrop(event) {
			
			file = event.originalEvent.dataTransfer.files[0];
			var fileReader = new FileReader;
			
			fileReader.onload = onLoaded;
			fileReader.readAsText(file);
			
			cancel(event);
			
			return false;
			
		}
		
		function onLoaded(event) {
			
			var data      = JSON.parse(event.target.result);
			var lists     = data.lists;
			var endListID = '';
			
			for (var p in lists) {
				
				var obj = lists[p];
				if (/了/.test(obj.name)) endListID = obj.id;
				
			}
			
			var members = (function(array) {
				
				var data = {};
				
				for (var p in array) {
					
					var obj = array[p];
					data[obj.id] = obj.fullName;
					
				}
				
				return data;
				
			})(data.members);
			
			var csv    = [];
			var cards  = data.cards;
			var length = cards.length;
			
			for (var i = 0; i < length; i++) {
				
				var card = cards[i];
				var list = card.idList;
				var data = [];
				
				if (!card.closed && list == endListID) {
					
					var cardName    = card.name;
					var cardMembers = card.idMembers;
					
					data.push(cardName);
					
					for (var q in cardMembers) {
						data.push(members[cardMembers[q]]);
					}
					
					csv[i] = data;
					
				}
				
			}
			
			exportCSV({ data:csv });
			
			return false;
			
		}
		
		function onEnter(event) {
			
			cancel(event);
			return false;
			
		}
		
		function onOver(event) {
			
			cancel(event);
			return false;
			
		}
		
		function cancel(event) {
			
			event.preventDefault();
			event.stopPropagation();
			
			return false;
			
		}
		
		return false;
		
	}
	
	function exportCSV(data,onSuccess,onError) {
		
		$.ajax({

			type          : 'POST',
			url           : "files/php/exportCSV.php",
			data          : data,
			cache         : false,
			scriptCharset : 'utf-8',
			success       : onSuccess

		});
		
		function onSuccess() {
			
			var filename = 'data.csv';
			var anchor   = document.createElement('a');
			
			anchor.download = filename;
			anchor.href     = 'files/php/' + filename;
			anchor.target   = '_blank';
			
			document.body.appendChild(anchor);
			anchor.click();
			
			document.body.removeChild(anchor);
			
			return false;
			
		}
		
		return false;

	}
	
	function test(value) {
		
		if (console) console.log(value);
		else alert(value);
		
		return false;
		
	}
	
	return false;
	
})(jQuery);