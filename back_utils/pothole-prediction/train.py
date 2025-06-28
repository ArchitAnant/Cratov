import torch
import torch.nn as nn
from torch.utils.tensorboard import SummaryWriter
from tqdm import tqdm

class PotholePredictionTrainner:
    def __init__(self, epochs,model, train_dataloader, test_dataloader, criterion = None, optimizer=None,scheduler=None,device=None):
        """
        Args:
            epochs (int): Number of training epochs.
            model (torch.nn.Module): The model to be trained.
            train_dataloader (torch.utils.data.DataLoader): DataLoader for the training dataset.
            test_dataloader (torch.utils.data.DataLoader): DataLoader for the testing dataset.
            criterion (torch.nn.Module, optional): Loss function. Defaults to nn.BCEWithLog
            optimizer (torch.optim.Optimizer, optional): Optimizer for training. Defaults to Adam with lr=0.001.
            scheduler (torch.optim.lr_scheduler, optional): Learning rate scheduler. Defaults to ReduceLRO
            device (torch.device, optional): Device to run the training on. Defaults to "cuda" if available, else "cpu".

        Example:
            trainer = PotholePredictionTrainner(epochs=10, model=my_model,
                                                train_dataloader=train_loader,
                                                test_dataloader=test_loader)
            trainer.train_model()
        """
        self.model = model
        self.train_dataloader = train_dataloader
        self.test_dataloader = test_dataloader

        if epochs is None:
            self.epochs = 10
        else:
            self.epochs = epochs

        if criterion is None:
            self.criterion = nn.BCEWithLogitsLoss()
        else:
            self.criterion = criterion
        
        if optimizer is None:
            self.optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
        else:
            self.optimizer = optimizer

        if device is None:
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        else:
            self.device = device

        if scheduler is None:
            self.scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(self.optimizer, mode='min', patience=2, factor=0.5)
        else:
            self.scheduler = scheduler


    def _train_one_epoch(model, loader, criterion, optimizer, device):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        for images, labels in loader:
            images = images.to(device)
            labels = labels.float().unsqueeze(1).to(device)  # Shape: (B, 1)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item()

            # Accuracy
            preds = (torch.sigmoid(outputs) > 0.5).float()
            correct += (preds == labels).sum().item()
            total += labels.size(0)

        avg_loss = running_loss / len(loader)
        accuracy = 100 * correct / total
        return avg_loss, accuracy

    def _evaluate(model, loader, criterion, device):
        model.eval()
        running_loss = 0.0
        correct = 0
        total = 0

        with torch.no_grad():
            for images, labels in loader:
                images = images.to(device)
                labels = labels.float().unsqueeze(1).to(device)

                outputs = model(images)
                loss = criterion(outputs, labels)
                running_loss += loss.item()

                preds = torch.sigmoid(outputs) > 0.5
                correct += (preds == labels.bool()).sum().item()
                total += labels.size(0)

        avg_loss = running_loss / len(loader)
        accuracy = 100 * correct / total
        return avg_loss, accuracy

    def train_model(self):
        writer = SummaryWriter(log_dir="runs/Pothole_Classification")
        for epoch in tqdm(range(self.epochs), desc="Training Epochs"):
            train_loss, train_acc = self.train_one_epoch(self.model, self.train_dataloader, self.criterion, self.ptimizer, self.device)
            val_loss, val_acc = self._evaluate(self.model, self.test_dataloader, self.criterion, self.device)
            self.scheduler.step(val_loss)

            writer.add_scalar("Loss/train", train_loss, epoch)
            writer.add_scalar("Loss/val", val_loss, epoch)
            writer.add_scalar("Accuracy/train", train_acc, epoch)
            writer.add_scalar("Accuracy/val", val_acc, epoch)

        print(f"Train   Loss: {train_loss:.4f} | Acc: {train_acc:.2f}%")
        print(f"Val     Loss: {val_loss:.4f} | Acc: {val_acc:.2f}%")
        writer.close()